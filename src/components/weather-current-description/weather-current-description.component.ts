import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'weather-current-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [``],
  template: `
    {{ descripion | uppercase}}
  `
})
export class WeatherCurrentDescriptionComponent {
  @Input() descripion: string;
}
