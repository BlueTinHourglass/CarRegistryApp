# CarRegistryApp

This project displays a simple car registry application built with Angular. The main page @ '/' shows a list of cars fetched from a backend API. There is a dropdown menu that allows users to filter the cars by their make by adding an optional query parameter 'make' to the GET request.
When a car is selected from the list, the application displays a second table @ '/registration' which shows live data of the car's registration details and expiry status fetched from a backend background server. The table uses SignalR for real-time updates, ensuring that any changes to the registration details are reflected immediately without needing to refresh the page. For example if the user were to set there system time to a date many years in the future, the webpage would display that the registration has expired for every car.

Created in Visual Studio 2025.

# CarregistryappClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
