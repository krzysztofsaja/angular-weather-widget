import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularWeatherWidgetModule } from '../src';
import { DemoComponent } from './demo.component';
import { WeatherApiName } from '../src/services/api/weather.api.service';
import { FormsModule } from '@angular/forms';

declare var OPEN_WEATHER_MAP_API_KEY: string;
@NgModule({
  declarations: [DemoComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AngularWeatherWidgetModule.forRoot({
      key: OPEN_WEATHER_MAP_API_KEY,
      name: WeatherApiName.OPEN_WEATHER_MAP,
      baseUrl: 'http://api.openweathermap.org/data/2.5'
    })
  ],
  bootstrap: [DemoComponent]
})
export class DemoModule {}
