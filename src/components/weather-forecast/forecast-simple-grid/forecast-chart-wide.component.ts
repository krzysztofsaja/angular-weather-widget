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
  selector: 'weather-forecast-chart-wide',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
           `
  ],
  template: `
    <div>

    </div>

  `
})
export class WeatherForecastChartWideComponent {
  @Input() forecast: Forecast[];
  constructor(private helpers: WeatherHelpersService) {}
}
