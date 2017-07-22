import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Forecast } from '../../../services/api/weather.api.service';
import { WeatherHelpersService } from '../../../services/weather-helpers.service';

@Component({
  selector: 'weather-forecast-simple-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
           :host {
             display: flex;
             width: 100%;
             justify-content: space-between;
           }
           weather-forecast-grid-day {
             margin: 0 0.4em;
           }
           `
  ],
  template: `
    <ng-container *ngFor="let forecast of forecastPerDay">
      <weather-forecast-grid-day [forecast]="forecast"></weather-forecast-grid-day>
    </ng-container>
  `
})
export class WeatherForecastSimpleGridComponent {
  forecastPerDay: Forecast[];
  @Input()
  set forecast(value: Forecast[]) {
    if (!value) {
      return;
    }
    this._forecast = value;
    this.forecastPerDay = this.weatherHelpers.reduceToAveragePerDay(
      this._forecast
    );
  }
  get forecast(): Forecast[] {
    return this._forecast;
  }
  private _forecast: Forecast[];
  constructor(private weatherHelpers: WeatherHelpersService) {}
}
