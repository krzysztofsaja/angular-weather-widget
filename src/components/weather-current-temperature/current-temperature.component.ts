import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'weather-current-temperature',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
  :host {
    display: block;
    line-height: 1.1em;
  }
    .deg {
      letter-spacing: -0.13em;
      position: relative;
      left: -0.2em;
    }
  `
  ],
  template: `
      {{ temp?.toFixed() }} <span *ngIf="temp" class="deg">&deg; {{ unitSymbol }}</span>
  `
})
export class WeatherCurrentTempComponent {
  unitSymbol: string;
  @Input() temp: number;
  get deg(): TemperatureScale {
    return this._deg;
  }

  @Input()
  set deg(value: TemperatureScale) {
    this._deg = value;
    switch (value) {
      case TemperatureScale.CELCIUS:
        this.unitSymbol = 'C';
        break;
      case TemperatureScale.FAHRENHEIT:
        this.unitSymbol = 'F';
        break;
      case TemperatureScale.KELVIN:
        this.unitSymbol = 'K';
        break;
      default:
        this.unitSymbol = 'C';
    }
  }
  private _deg: TemperatureScale = TemperatureScale.CELCIUS;
}

export enum TemperatureScale {
  CELCIUS = <any>'celcius',
  KELVIN = <any>'kelvin',
  FAHRENHEIT = <any>'fahrenheit'
}
