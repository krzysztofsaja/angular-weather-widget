import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TemperatureScale } from '../../../components/weather-current-temperature/current-temperature.component';
import { PoolingService } from '../../poling.service';
import {
  CurrentWeather,
  Forecast,
  WeatherApiConfig,
  WeatherApiService
} from '../weather.api.service';
import { iconCodes, IconCodeType } from './open-weather-map-to-weather-icons';
import { WeatherQueryParams } from '../../../weather.interfaces';

@Injectable()
export class OpenWeatherMapApiService extends WeatherApiService {
  iconCodes: IconCodeType;
  iconCodes$: Observable<any>;
  constructor(
    protected http: Http,
    protected poolingService: PoolingService,
    public apiConfig: WeatherApiConfig
  ) {
    super(http, poolingService, apiConfig);
    this.iconCodes = iconCodes;
  }

  protected mapQueryParams(
    params: WeatherQueryParams
  ): OpenWeatherMapLocationRequest {
    const mapped: OpenWeatherMapLocationRequest = {
      id: params.cityId,
      q: params.cityName,
      lat: params.latLng ? params.latLng.lat : undefined,
      lon: params.latLng ? params.latLng.lng : undefined,
      zip: params.zipCode,
      units: params.units ? this.mapUnits(params.units) : undefined,
      lang: params.lang
    };
    return mapped;
  }

  protected mapCurrentWeatherResponse(
    response: OpenWeatherMapCurrentWeatherResponse
  ): CurrentWeather {
    if (!response) {
      return <CurrentWeather>{};
    }
    const weather: CurrentWeather = {
      temp: response.main.temp,
      pressure: response.main ? response.main.pressure : undefined,
      humidity: response.main ? response.main.humidity : undefined,
      minTemp:
        response.main && response.main.temp
          ? response.main.temp_min
          : undefined,
      maxTemp:
        response.main && response.main.temp
          ? response.main.temp_max
          : undefined,
      sunrise: response.sys ? response.sys.sunrise : undefined,
      sunset: response.sys ? response.sys.sunset : undefined,
      location: response.name,
      iconUrl: this.mapResponseToIconUrl(response),
      iconClass: this.mapResponseToIconClass(response),
      description: response.weather[0].description,
      wind: {
        deg: response.wind.deg,
        speed: response.wind.speed
      }
    };
    return weather;
  }

  protected mapForecastResponse(
    response: OpenWeatherMapForecastResponse
  ): Forecast[] {
    if (!response) {
      return <Forecast[]>[];
    }
    const city = response.city;
    return response.list.map((el: OpenWeatherMapForecastResponseElement) => {
      const forecast: Forecast = {
        temp: el.main.temp,
        pressure: el.main.pressure,
        humidity: el.main.humidity,
        minTemp: el.main.temp_min,
        maxTemp: el.main.temp_max,
        location: city.name,
        iconClass: this.mapResponseToIconClass(el),
        description: el.weather[0].description,
        data: new Date(el.dt * 1000),
        wind: {
          deg: el.wind.deg,
          speed: el.wind.speed
        }
      };
      return forecast;
    });
  }

  protected mapResponseToIconUrl(
    response: OpenWeatherMapCurrentWeatherResponse
  ): string {
    return `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;
  }

  protected mapResponseToIconClass(
    response:
      | OpenWeatherMapCurrentWeatherResponse
      | OpenWeatherMapForecastResponseElement
  ): string {
    const code = response.weather[0].id;
    const prefix = 'wi wi-';
    let icon = iconCodes[code].icon;
    // If we are not in the ranges mentioned above, add a day/night prefix.
    if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
      icon = 'day-' + icon;
    }
    icon = prefix + icon;
    return icon;
  }

  protected setTokenKey() {
    return 'APPID';
  }

  private mapUnits(unit: TemperatureScale) {
    switch (unit) {
      case TemperatureScale.CELCIUS:
        return 'metric';
      case TemperatureScale.FAHRENHEIT:
        return 'imperial';
      case TemperatureScale.KELVIN:
        return;
      default:
        return 'metric';
    }
  }
}

export interface OpenWeatherMapLocationRequest {
  id?: number;
  q?: string;
  lat?: number;
  lon?: number;
  zip?: number;
  units?: 'imperial' | 'metric';
  lang?: string;
}

export interface OpenWeatherMapCurrentWeatherResponse {
  coord: { lon: number; lat: number };
  weather: [{ id: number; main: string; description: string; icon: string }];
  base: string;
  main: {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    message: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  id: number;
  name: string;
  cod: number;
}

export interface OpenWeatherMapForecastResponse {
  city: {
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    id: number;
    name: string;
  };
  message: number;
  cod: string;
  cnt: number;
  list: OpenWeatherMapForecastResponseElement[];
}

export interface OpenWeatherMapForecastResponseElement {
  clouds: {
    all: number;
  };
  dt: number;
  dt_txt: string;
  main: {
    grnd_level: number;
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    temp_kf: number;
    sea_level: number;
  };
  sys: {
    pod: string;
  };
  weather: [{ id: number; main: string; description: string; icon: string }];
  wind: { speed: number; deg: number };
}
