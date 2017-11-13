import {
  Component,
  Input,
  ElementRef,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ChartOptions, ChartData, Chart } from 'chart.js';
@Component({
  selector: 'weather-chart',
  template: '<canvas></canvas>',
  styles: [':host { display: block; }']
})
export class ChartComponent implements OnInit, OnChanges {
  chart: any;

  @Input()
  type: 'line' | 'bar' | 'radar' | 'pie' | 'polarArea' | 'bubble' | 'scatter';
  @Input() data: ChartData;
  @Input() options: ChartOptions;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.options.scales = {
        yAxes: [{
            ticks: {
                // Remove excess decimal places
                callback: function(value, index, values) {
                    return Number(value.toFixed(0));
                }
            }
        }]
    };
    this.chart = new Chart(
      this.elementRef.nativeElement.querySelector('canvas'),
      {
        type: this.type,
        data: this.data,
        options: this.options
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart && changes['data']) {
      const currentValue = changes['data'].currentValue;
      ['datasets', 'labels', 'xLabels', 'yLabels'].forEach(property => {
        this.chart.data[property] = currentValue[property];
      });
      this.chart.update();
    }
  }
}
