import { Inject, Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { PoolingService } from '../poling.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';
import { TemperatureScale } from '../../components/weather-current-temperature/current-temperature.component';
import { WeatherQueryParams } from '../../weather.interfaces';

@Injectable()
export abstract class WeatherApiService {
  poollingInterval = 60000 * 60;
  constructor(
    protected http: Http,
    protected poolingService: PoolingService,
    @Inject('WEATHER_CONFIG') public apiConfig: WeatherApiConfig
  ) {}

  currentWeather(queryParams: WeatherQueryParams): Observable<CurrentWeather> {
    return this.callApi(queryParams, '/weather').map(
      this.mapCurrentWeatherResponse.bind(this)
    );
  }

  forecast(queryParams: WeatherQueryParams): Observable<Forecast[]> {
    return this.callApi(queryParams, '/forecast').map(
      this.mapForecastResponse.bind(this)
    );
  }

  protected callApi(
    queryParams: WeatherQueryParams,
    endpoint: string
  ): Observable<any> {
    const params = this.mapQueryParams(queryParams);
    const requestOptions = this.getRequestOptions(params);
    const apiCall: Observable<any> = this.http
      .get(`${this.apiConfig.baseUrl}/${endpoint}`, requestOptions)
      .map(resp => resp.json())
      .filter(el => !!el);
    return this.wrapWithPoll(apiCall);
  }

  protected setTokenKey(): string {
    // Implement it in child service
    return '';
  }

  protected mapQueryParams(params: WeatherQueryParams): any {
    // Implement it in child service
    return;
  }

  protected mapCurrentWeatherResponse(response: any): CurrentWeather {
    // Implement it in child service
    return <CurrentWeather>{};
  }

  protected mapForecastResponse(response: any): Forecast[] {
    // Implement it in child service
    return <Forecast[]>[];
  }

  protected mapResponseToIconUrl(response: any): string {
    return '';
  }
  protected mapResponseToIconClass(response: any): string {
    return '';
  }

  private wrapWithPoll(apiCall: Observable<any>) {
    return this.poolingService.execute(() => apiCall, this.poollingInterval);
  }

  private getRequestOptions(queryParams: Object) {
    return new RequestOptions({
      headers: new Headers(),
      params: this.getQueryParams(queryParams)
    });
  }

  private getQueryParams(obj: { [key: string]: any }): URLSearchParams {
    const queryParams = new URLSearchParams();
    queryParams.set(this.setTokenKey(), this.apiConfig.key);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        queryParams.set(key.toString(), obj[key]);
      }
    }
    return queryParams;
  }
}

export interface CurrentWeather {
  location: string;
  temp: number;
  pressure?: number;
  humidity?: number;
  minTemp?: number;
  maxTemp?: number;
  sunrise?: number;
  sunset?: number;
  iconClass?: string;
  iconUrl?: string;
  description?: string;
  wind?: {
    deg: number;
    speed: number;
  };
}

export interface Forecast extends CurrentWeather {
  data: Date;
}

export class WeatherApiConfig {
  name: WeatherApiName = WeatherApiName.OPEN_WEATHER_MAP;
  key = 'provide secret key';
  baseUrl = 'http://api.openweathermap.org/data/2.5';
}

export enum WeatherApiName {
  OPEN_WEATHER_MAP = <any>'Open Weather Map'
}
