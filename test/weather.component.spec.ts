import { inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { AngularWeatherWidgetModule } from '../src';
import { WeatherContainer } from '../src/weather.container';
import { WeatherApiName } from '../src/services/api/weather.api.service';

declare var OPEN_WEATHER_MAP_API_KEY;

xdescribe('weather-container', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularWeatherWidgetModule.forRoot({
          key: OPEN_WEATHER_MAP_API_KEY,
          name: WeatherApiName.OPEN_WEATHER_MAP,
          baseUrl: 'http://api.openweathermap.org/data/2.5'
        })
      ]
    });
  });

  it('should say hello world', () => {
    const fixture: ComponentFixture<WeatherContainer> = TestBed.createComponent(
      WeatherContainer
    );
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML.trim()).to.equal(
      'Hello world from the angular weather module!'
    );
  });
});
