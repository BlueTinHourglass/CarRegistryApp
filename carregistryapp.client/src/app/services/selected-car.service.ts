import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Car } from '../models/car.model';

@Injectable({ providedIn: 'root' })
export class SelectedCarService {
  private selectedSubject = new BehaviorSubject<Car | null>(null);

  setSelected(car: Car | null) {
    this.selectedSubject.next(car);
  }

  get selected$(): Observable<Car | null> {
    return this.selectedSubject.asObservable();
  }

  get current(): Car | null {
    return this.selectedSubject.getValue();
  }
}
