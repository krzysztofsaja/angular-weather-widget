import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'weather-location',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    :host {
      margin-top: 1em;
      font-size: 1em;
    }
  `
  ],
  template: `
    {{ place }}

  `
})
export class WeatherLocationComponent {
  @Input() place: string;
}
