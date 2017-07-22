import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'weather-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    button {
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1.6em;
      border-radius: 50%;
      color: inherit;
    }
    button:hover {
      background: rgba(0,0,0, 0.1);
    }
  `
  ],
  template: `
    <button (click)="update.emit()"><i class="wi wi-refresh"></i></button>
  `
})
export class WeatherActionsComponent {
  @Output() update: EventEmitter<any> = new EventEmitter();
}
