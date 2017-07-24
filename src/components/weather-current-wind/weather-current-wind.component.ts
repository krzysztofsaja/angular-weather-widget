import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { TemperatureScale } from '../weather-current-temperature/current-temperature.component';
import { WeatherSettings } from '../../weather.interfaces';

@Component({
  selector: 'weather-current-wind',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    :host {
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 0.8em;
      min-height: 1.3em;
    }
    i {
      margin-left: 0.3em;
      font-size: 1.6em;
    }
  `
  ],
  template: `
    <span>Wind {{ speed }} {{ unit }}</span>
   <i [class]="windIcon"></i>
  `
})
export class WeatherCurrentWindComponent {
  unit: string;
  get scale() {
    return this._scale;
  }

  @Input()
  set scale(value) {
    this._scale = value;
    this.unit = this.mapScaleToText(this._scale);
  }
  windIcon: string;
  get deg(): number {
    return this._deg;
  }

  @Input()
  set deg(value: number) {
    if (!value) {
      return;
    }
    this._deg = value;
    this.windIcon = `wi wi-wind from-${this._deg}-deg`;
  }
  private _deg: number;
  @Input() speed: number;
  private _scale: TemperatureScale;

  mapScaleToText(scale: TemperatureScale): string {
    switch (scale) {
      case TemperatureScale.CELCIUS:
      case TemperatureScale.KELVIN:
        return 'm/s';
      case TemperatureScale.FAHRENHEIT:
        return 'mil/h';
      default:
        return '';
    }
  }
}
