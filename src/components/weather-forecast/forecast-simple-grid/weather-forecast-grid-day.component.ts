import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Forecast } from '../../../services/api/weather.api.service';

@Component({
  selector: 'weather-forecast-grid-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
   :host {
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     font-size: 1.2em;
   }
   weather-icon {
     font-size: 1.4em;
   }
   .day {
     font-size: 0.8em
   }
 `
  ],
  template: `
      <weather-icon [iconClass]="forecast?.iconClass"></weather-icon>
      <weather-current-temperature [temp]="forecast?.temp"></weather-current-temperature>
      <div class="day">{{forecast?.data | date:'EEE' }}</div>
  `
})
export class WeatherForecastGridDayComponent {
  @Input() forecast: Forecast;
}
