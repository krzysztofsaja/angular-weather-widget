import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Forecast } from '../../../services/api/weather.api.service';
import { WeatherHelpersService } from '../../../services/weather-helpers.service';
import { WeatherSettings } from '../../../weather.interfaces';

@Component({
  selector: 'weather-forecast-detail-day',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
             :host {
               display: flex;
               align-items: center;
               padding: 0.1em 0;
               font-size: 1em;
               box-sizing: border-box;
               justify-content: flex-start;
               width: 100%;

             }
             :host > * {
               padding: 0 0.4em;
             }
             .left {
               flex-grow: 0;
             }
             weather-chart {
               height: 80px;
               width: 80%;
               flex: 1 1;
             }

             weather-icon {
               margin-top: 0.3em;
               font-size: 1.4em;
               display: block;
             }
           `
  ],
  template: `
    <div class="left">
      {{forecast[0]?.data | date:'EEE' }}
      <weather-icon [iconClass]="forecast[0]?.iconClass"></weather-icon>
    </div>
    <weather-chart
      [type]="'line'"
      [data]="chartData"
      [options]="chartOptions"
    ></weather-chart>
  `
})
export class WeatherForecastDetailDayComponent implements OnChanges {
  chartData: ChartData;
  chartOptions: ChartOptions;
  @Input() settings: WeatherSettings;

  @Input()
  set forecast(value: Forecast[]) {
    this._forecast = value;
  }
  get forecast(): Forecast[] {
    return this._forecast;
  }
  private _forecast: Forecast[];

  constructor(private weatherHelpers: WeatherHelpersService) {}

  ngOnChanges(change: SimpleChanges) {
    if (this.settings && change['forecast']) {
      this.updateChartOptions();
      this.chartData = this.weatherHelpers.mapForecastToCharts(
        this._forecast,
        this.settings.color
      );
    }
  }

  private updateChartOptions() {
    this.chartOptions = {
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'hour',
              isoWeekday: true,
              displayFormats: {
                hour: 'hA'
              },
              tooltipFormat: 'LLL'
            },
            gridLines: {
              display: false
            },
            ticks: {
              display: true,
              fontColor:
                this.settings && this.settings.color
                  ? this.weatherHelpers.hexToRgbA(this.settings.color, '0.8')
                  : 'white',
              fontSize: 9,
              maxTicksLimit: 3
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              fontColor:
                this.settings && this.settings.color
                  ? this.weatherHelpers.hexToRgbA(this.settings.color, '0.8')
                  : 'white',
              fontSize: 9,
              autoSkip: true,
              labelOffset: 0,
              mirror: false,
              maxTicksLimit: 3,
              callback: function(value, index, values) {
                return value;
              }
            }
          }
        ]
      },
      maintainAspectRatio: false,
      legend: {
        display: false,
        position: 'bottom'
      },
      title: {
        display: false
      }
    };
  }
}
