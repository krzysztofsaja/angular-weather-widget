import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Forecast } from '../../services/api/weather.api.service';
import { ForecastMode, WeatherSettings } from '../../weather.interfaces';
import preventExtensions = Reflect.preventExtensions;

@Component({
  selector: 'weather-forecast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
             :host {
               margin-top: 1em;
               display: block;
               width: 100%;
               box-sizing: border-box;
             }
           `
  ],
  template: `
    <weather-forecast-simple-grid
      *ngIf="isGridForecast"
      [forecast]="forecast"></weather-forecast-simple-grid>
    <weather-forecast-detailed
      *ngIf="!isGridForecast"
      [settings]="settings"
      [forecast]="forecast"></weather-forecast-detailed>
  `
})
export class WeatherForecastComponent {
  isGridForecast = true;
  @Input()
  set mode(value: ForecastMode) {
    if (!value) {
      return;
    }
    switch (value) {
      case ForecastMode.GRID:
        this.isGridForecast = true;
        break;
      case ForecastMode.DETAILED:
        this.isGridForecast = false;
        break;
      default:
        this.isGridForecast = false;
    }
  }
  @Input() settings: WeatherSettings;
  @Input()
  set forecast(value: Forecast[]) {
    if (!value) {
      return;
    }
    this._forecast = value;
  }

  get forecast(): Forecast[] {
    return this._forecast;
  }
  private _forecast: Forecast[];
}
