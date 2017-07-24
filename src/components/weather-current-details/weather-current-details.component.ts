import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'weather-current-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    :host {
      font-size: 0.8em;
      text-align: center;
      margin-top: 1em;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
    }
    .row span {
      margin: 0 0.3em;
    }
    .wi {
      margin-right: 0.3em;
    }
  `
  ],
  template: `
    <div class="row">
      <i class="wi wi-thermometer"></i>
      <span>
          <span>Min: {{minTemp}}&deg;</span>
          <span>Max: {{maxTemp}}&deg;</span>
      </span>

    </div>
    <div class="row">
      <span><i class="wi wi-barometer"></i>Pressure: {{pressure}}</span>
      <span><i class="wi wi-humidity"></i>Humidity: {{humidity}}%</span>
    </div>
  `
})
export class WeatherCurrentDetailsComponent {
  @Input() maxTemp: number;
  @Input() minTemp: number;
  @Input() pressure: number;
  @Input() humidity: number;
}
