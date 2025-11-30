import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { retryWhen, delay, tap, take } from 'rxjs/operators';
import { SelectedCarService } from './services/selected-car.service';
import { Car } from './models/car.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public cars: Car[] = [];
  public selectedCar: Car | null = null;

  constructor(private http: HttpClient, private router: Router, private selectedSvc: SelectedCarService) { }

  ngOnInit() {
    this.getCarsWithRetry('');
  }

  onSelect(event: Event) {
    this.getCarsWithRetry((event.target as HTMLSelectElement).value);
  }

  private getCarsWithRetry(inMake: string) {
    const maxRetries = 8;
    const baseDelayMs = 250; // exponential backoff base

    this.http.get<Car[]>('/car', { params: { make: inMake } })
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            tap((err) => console.warn('GET /car failed, will retry', err)),
            delay(baseDelayMs),
            take(maxRetries)
          )
        )
      )
      .subscribe({
        next: (result) => {
          this.cars = result;
          if (this.selectedCar) {
            const keep = this.cars.find(c => c.registration === this.selectedCar!.registration) ?? null;
            this.selectedCar = keep;
            // update shared selection in case kept object identity changed
            this.selectedSvc.setSelected(this.selectedCar);
          }
        },
        error: (error) => console.error('Failed to load cars after retries', error)
      });
  }

  // select a car from the table
  selectCar(car: Car) {
    console.log('Selected:', car);
    this.selectedCar = car;
    this.selectedSvc.setSelected(car);
    // navigate to registration route
    this.router.navigate(['/registration']).catch(err => {
      console.warn('Navigation to /registration failed', err);
    });
  }

  isSelected(car: Car): boolean {
    return this.selectedCar?.registration === car.registration;
  }

  title = 'angularappcars.client';
}

