import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'weather-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [``],
  template: `
    <i *ngIf="iconClass" [class]="iconClass"></i>
    <img *ngIf="iconImageUrl && !iconClass" [src]="iconImageUrl">
  `
})
export class WeatherIconComponent {
  @Input() iconClass: string;
  @Input() iconImageUrl: string;
  @Input() title: string;
}
