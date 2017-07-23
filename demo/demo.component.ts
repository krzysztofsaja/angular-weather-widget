import { Component } from '@angular/core';
import { TemperatureScale } from '../src/components/weather-current-temperature/current-temperature.component';
import { ForecastMode, WeatherSettings } from '../src/weather.interfaces';

@Component({
  selector: 'weather-demo-app',
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        background: #fafafa;
      }

      .menu {
        display: flex;
        flex-direction: column;
        width: 250px;
        background-color: #ddd;
        margin: 3em;
        padding: 1em;
      }
      .row {
        padding: 0.4em;
      }


      `
  ],
  template: `
    <div class="menu">
      <div class="row"> Place<input type="text" [(ngModel)]="settings.location.cityName"></div>
      <div class="row">Color<input type="text" [(ngModel)]="settings.color"></div>
      <div class="row">Background color<input type="text" [(ngModel)]="settings.backgroundColor"></div>
      <div class="row">Width<input type="text" [(ngModel)]="settings.width"></div>
      <div class="row">Height<input type="text" [(ngModel)]="settings.height"></div>
      <div class="row">Show Wind<input type="checkbox" [(ngModel)]="settings.showWind"></div>
      <div class="row"> Show Details<input type="checkbox" [(ngModel)]="settings.showDetails"></div>
      <div class="row"> Show Forecast<input type="checkbox" [(ngModel)]="settings.showForecast"></div>
      <div class="row">Forecast Mode
        <select [(ngModel)]="settings.forecastMode">
          <option [value]="'DETAILED'">Detailed</option>
          <option [value]="'GRID'">Grid</option>
        </select>
      </div>
      <div class="row">Temperature units
        <select [(ngModel)]="settings.scale">
          <option [value]="'celcius'">Celcius</option>
          <option [value]="'kelvin'">Kelvin</option>
          <option [value]="'fahrenheit'">Fahrenheit</option>
        </select>
      </div>
      <button (click)="onUpdate()">Update</button>
    </div>
    <weather-widget [settings]="settings"></weather-widget>`
})
export class DemoComponent {
  settings: WeatherSettings = {
    location: {
      cityName: 'Szczecin'
    },
    scale: TemperatureScale.CELCIUS,
    backgroundColor: '#347c57',
    color: '#ffffff',
    width: '300px',
    height: 'auto',
    showWind: false,
    showDetails: false,
    showForecast: true,
    forecastMode: ForecastMode.DETAILED,
    language: 'en'
  };

  onUpdate() {
    this.settings = Object.assign({}, this.settings);
  }
}
