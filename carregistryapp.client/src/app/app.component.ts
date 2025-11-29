import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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
    setTimeout(() => this.getCars(''), 5000); // delay 5.0s so the frontend doesn't make a GET request before the backend is fully ready
  }

  onSelect(event: Event) {
    this.getCars((event.target as HTMLSelectElement).value);
  }

  getCars(inMake: string) {
    this.http.get<Car[]>('/car', { params: { make: inMake }, }).subscribe(
      (result) => {
        this.cars = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'angularappcars.client';
}
