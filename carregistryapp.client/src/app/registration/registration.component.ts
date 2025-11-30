import { Component, OnInit, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subscription } from 'rxjs';
import { SelectedCarService } from '../services/selected-car.service';
import { Car } from '../models/car.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  public cars: Car[] = []; // full list from hub for lookups
  public displayedCar: Car | null = null; // only the selected car shown in template

  private hubConnection!: signalR.HubConnection;
  private selSub?: Subscription;

  constructor(private selectedSvc: SelectedCarService) {}

  ngOnInit() {
    // subscribe to selection changes
    this.selSub = this.selectedSvc.selected$.subscribe(sel => {
      console.log('RegistrationComponent: selected changed', sel);
      this.displayedCar = sel ? this.findLatestFor(sel.registration) : null;
    });

    // start SignalR
    const hubUrl = location.hostname === 'localhost' ? 'https://localhost:7079/carHub' : '/carHub';
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, { transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveCarUpdates', (updatedCars: Car[]) => {
      console.log('RegistrationComponent: Received cars', updatedCars);
      this.cars = updatedCars;
      const current = this.selectedSvc.current;
      this.displayedCar = current ? this.findLatestFor(current.registration) : null;
    });

    this.hubConnection.start()
      .then(() => console.log('RegistrationComponent: Connected to SignalR hub'))
      .catch(err => console.error('RegistrationComponent: Error connecting to hub:', err));
  }

  private findLatestFor(registration?: string): Car | null {
    if (!registration) return null;
    return this.cars.find(c => c.registration === registration) ?? null;
  }

  ngOnDestroy() {
    this.hubConnection?.stop().catch(e => console.warn('Error stopping hub', e));
    this.selSub?.unsubscribe();
  }
}
