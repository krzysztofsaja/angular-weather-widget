import { ModuleWithProviders, NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import {
  WeatherApiConfig,
  WeatherApiName,
  WeatherApiService
} from './services/api/weather.api.service';
import { PoolingService } from './services/poling.service';
import { WeatherContainer } from './weather.container';
import { CommonModule } from '@angular/common';
import { WeatherIconComponent } from './components/weather-icon/weather-icon.component';
import { WeatherCurrentDescriptionComponent } from './components/weather-current-description/weather-current-description.component';
import { WeatherCurrentTempComponent } from './components/weather-current-temperature/current-temperature.component';
import { WeatherActionsComponent } from './components/weather-actions/actions.component';
import { WeatherLocationComponent } from './components/weather-location/weather-location.component';
import { WeatherCurrentWindComponent } from './components/weather-current-wind/weather-current-wind.component';
import { OpenWeatherMapApiService } from './services/api/open-weather-map/open-weather-map.api.service';
import { WeatherCurrentDetailsComponent } from './components/weather-current-details/weather-current-details.component';
import { WeatherForecastComponent } from './components/weather-forecast/weather-forecast.component';

import { WeatherForecastSimpleGridComponent } from './components/weather-forecast/forecast-simple-grid/forecast-simple-grid.component';
import { WeatherForecastGridDayComponent } from './components/weather-forecast/forecast-simple-grid/weather-forecast-grid-day.component';
import { WeatherForecastDetailedComponent } from './components/weather-forecast/forecast-detailed/forecast-detailed.component';
import { WeatherForecastDetailDayComponent } from './components/weather-forecast/forecast-detailed/forecast-detailed-day.component';
import { ChartComponent } from './components/chart/chart.component';
import { WeatherForecastChartWideComponent } from './components/weather-forecast/forecast-simple-grid/forecast-chart-wide.component';
import { WeatherHelpersService } from './services/weather-helpers.service';

export function apiServiceFactory(
  http: Http,
  pooling: PoolingService,
  openWeather: WeatherApiConfig
) {
  switch (openWeather.name) {
    case WeatherApiName.OPEN_WEATHER_MAP:
      return new OpenWeatherMapApiService(http, pooling, openWeather);
    default:
      return new OpenWeatherMapApiService(http, pooling, openWeather);
  }
}

export function forRoot(config: WeatherApiConfig): ModuleWithProviders {
  return {
    ngModule: AngularWeatherWidgetModule,
    providers: [
      PoolingService,
      WeatherHelpersService,
      {
        provide: WeatherApiService,
        useFactory: apiServiceFactory,
        deps: [Http, PoolingService, 'WEATHER_CONFIG']
      },
      { provide: 'WEATHER_CONFIG', useValue: config }
    ]
  };
}

@NgModule({
  imports: [CommonModule, HttpModule],
  declarations: [
    ChartComponent,
    WeatherContainer,
    WeatherCurrentTempComponent,
    WeatherActionsComponent,
    WeatherIconComponent,
    WeatherCurrentDescriptionComponent,
    WeatherLocationComponent,
    WeatherCurrentWindComponent,
    WeatherCurrentDetailsComponent,
    WeatherForecastComponent,
    WeatherForecastGridDayComponent,
    WeatherForecastSimpleGridComponent,
    WeatherForecastDetailedComponent,
    WeatherForecastDetailDayComponent,
    WeatherForecastChartWideComponent
  ],
  exports: [WeatherContainer]
})
export class AngularWeatherWidgetModule {
  constructor() {}
  static forRoot = forRoot;
}
export * from './weather.interfaces';
export { WeatherApiName } from './services/api/weather.api.service';
