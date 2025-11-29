import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { retryWhen, delay, tap, take, throwError } from 'rxjs';

export interface Car {
  expiryDate: string;
  make: string;
  registration: string;
  expiryStatus: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public cars: Car[] = [];

  constructor(private http: HttpClient) { }

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
            // exponential backoff delay
            tap((err) => console.warn('GET /car failed, will retry', err)),
            // use increasing delay: baseDelayMs * attempt
            delay(baseDelayMs),
            take(maxRetries)
          )
        )
      )
      .subscribe(
        (result) => this.cars = result,
        (error) => console.error('Failed to load cars after retries', error)
      );
  }

  title = 'angularappcars.client';
}

