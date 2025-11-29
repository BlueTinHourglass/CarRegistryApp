import { Component, OnInit, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';

interface Car {
  expiryDate: string;
  make: string;
  registration: string;
  expired: boolean;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  public cars: Car[] = [];
  private hubConnection!: signalR.HubConnection;

  ngOnInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('/carHub', {
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveCarUpdates', (updatedCars: Car[]) => {
      console.log('Received cars:', updatedCars);
      this.cars = updatedCars;
    });

    this.hubConnection.start()
      .then(() => console.log('Connected to SignalR hub'))
      .catch(err => console.error('Error connecting to hub:', err));
  }

  ngOnDestroy() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
