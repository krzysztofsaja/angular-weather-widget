import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Forecast } from '../../../services/api/weather.api.service';
import { WeatherHelpersService } from '../../../services/weather-helpers.service';
import { WeatherSettings } from '../../../weather.interfaces';

@Component({
  selector: 'weather-forecast-detailed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [``],
  template: `
    <ng-container *ngFor="let forecast of forecastPerDay">
      <weather-forecast-detail-day
        [settings]="settings"
        [forecast]="forecast"></weather-forecast-detail-day>
    </ng-container>

  `
})
export class WeatherForecastDetailedComponent {
  @Input()
  set forecast(value: Forecast[]) {
    if (!value) {
      return;
    }
    this._forecast = value;
    this.forecastPerDay = this.weatherHelpers.groupForecastsByDay(value);
  }
  @Input() settings: WeatherSettings;
  forecastPerDay: Array<Forecast[]> = [];
  private _forecast: Forecast[];
  constructor(private weatherHelpers: WeatherHelpersService) {}
}
