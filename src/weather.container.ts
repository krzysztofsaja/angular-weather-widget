import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { TemperatureScale } from './components/weather-current-temperature/current-temperature.component';
import {
  CurrentWeather,
  Forecast,
  WeatherApiService,
  WeatherQueryParams
} from './services/api/weather.api.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ForecastMode } from './components/weather-forecast/weather-forecast.component';

@Component({
  selector: 'weather-container',
  changeDetection: ChangeDetectionStrategy.Default,
  styles: [
    `
             :host {
               display: flex;
               position: relative;
               padding: 1.5em;
               box-sizing: border-box;
             }
             .info {
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
               width: 100%;
             }
             weather-actions {
               display: block;
               position: absolute;
               top: 10px;
               right: 10px;
             }
             weather-current-temperature.big {
               font-size: 3em;
             }
             weather-icon.big {
               font-size: 6em;
               padding: 0.15em;
             }
             .empty {
               flex-direction: row;
             }
             .empty i {
               font-size: 3em;
               margin-right: 0.3em;
             }

           `
  ],
  template: `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.10/css/weather-icons.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.10/css/weather-icons-wind.min.css">
    <div *ngIf="currentWeather" class="info">
      <weather-icon
        class="big"
        [iconImageUrl]="currentWeather?.iconUrl"
        [iconClass]="currentWeather?.iconClass"></weather-icon>
      <weather-current-description
        [descripion]="currentWeather?.description"></weather-current-description>
      <weather-current-wind
        *ngIf="settings.showWind"
        [scale]="settings.scale"
        [deg]="currentWeather?.wind.deg"
        [speed]="currentWeather?.wind.speed"></weather-current-wind>
      <weather-location [place]="currentWeather?.location"></weather-location>
      <weather-current-temperature
        class="big"
        [temp]="currentWeather?.temp"
        [deg]="settings.scale"></weather-current-temperature>
      <weather-current-details
        *ngIf="settings.showDetails"
        [maxTemp]="currentWeather?.maxTemp"
        [minTemp]="currentWeather?.minTemp"
        [pressure]="currentWeather?.pressure"
        [humidity]="currentWeather?.humidity"></weather-current-details>
      <weather-forecast
        *ngIf="settings.showForecast"
        [forecast]="forecast"
        [settings]="settings"
        [mode]="settings.forecastMode"></weather-forecast>

    </div>
    <div *ngIf="!currentWeather" class="info empty">
      <i class="wi wi-sunrise"></i>
      No weather data...
    </div>
    <weather-actions *ngIf="isMouseOn" (update)="getWeather()"></weather-actions>

  `
})
export // tslint:disable-next-line:component-class-suffix
class WeatherContainer implements OnDestroy {
  @HostBinding('style.background') background: string;
  @HostBinding('style.color') color: string;
  @HostBinding('style.width') width = 'auto';
  @HostBinding('style.height') height = 'auto';

  @Input() forecast: Forecast | null;
  @Input() currentWeather: CurrentWeather | null;
  @Input()
  set settings(value: WeatherSettings) {
    if (!value) {
      return;
    }
    this._settings = value;
    this.background = this._settings.backgroundColor || 'white';
    this.color = this._settings.color || 'black';
    this.width = this._settings.width;
    this.height = this._settings.height;
    if (this.weatherApi.apiConfig.name && this.weatherApi.apiConfig.key) {
      this.getWeather();
    }
  }

  get settings(): WeatherSettings {
    return this._settings;
  }

  subscriptionCurrentWeather: Subscription;
  subscriptionForecast: Subscription;
  currentWeather$: Observable<CurrentWeather>;
  forecast$: Observable<Forecast>;
  isMouseOn: boolean;

  private _settings: WeatherSettings;

  constructor(
    private weatherApi: WeatherApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private element: ElementRef
  ) {}

  ngOnDestroy() {
    if (this.subscriptionCurrentWeather) {
      this.subscriptionCurrentWeather.unsubscribe();
    }
    if (this.subscriptionForecast) {
      this.subscriptionForecast.unsubscribe();
    }
  }

  @HostListener('mouseenter')
  private onMouseEnter() {
    this.renderer.addClass(this.element.nativeElement, 'active');
    this.isMouseOn = true;
  }
  @HostListener('mouseleave')
  private onMouseLeave() {
    this.renderer.removeClass(this.element.nativeElement, 'active');
    this.isMouseOn = false;
  }

  getWeather(): void {
    if (this.subscriptionCurrentWeather) {
      this.subscriptionCurrentWeather.unsubscribe();
    }
    if (this.subscriptionForecast) {
      this.subscriptionForecast.unsubscribe();
    }
    this.currentWeather$ = this.currentWeatherCall();
    this.forecast$ = this.forecastCall();
    this.subscriptionCurrentWeather = this.currentWeather$.subscribe(data => {
      this.currentWeather = data;
      this.changeDetectorRef.markForCheck();
    });
    this.subscriptionForecast = this.forecast$.subscribe(data => {
      this.forecast = data;
      this.changeDetectorRef.markForCheck();
    });
  }

  currentWeatherCall(): Observable<CurrentWeather> {
    const params: WeatherQueryParams = Object.assign(
      {},
      this.settings.location,
      { units: this.settings.scale },
      { lang: this.settings.language }
    );
    return this.weatherApi.currentWeather(params);
  }

  forecastCall(): Observable<Forecast> {
    const params: WeatherQueryParams = Object.assign(
      {},
      this.settings.location,
      { units: this.settings.scale },
      { lang: this.settings.language }
    );
    return this.weatherApi.forecast(params);
  }
}

export class WeatherSettings {
  location: WeatherQueryParams = { cityName: 'Szczecin' };
  scale: TemperatureScale = TemperatureScale.CELCIUS;
  backgroundColor? = 'white';
  color? = 'black';
  width?: any;
  height?: any;
  showWind?: boolean;
  showDetails?: boolean;
  showForecast?: boolean;
  language?: string;
  forecastMode?: ForecastMode;
}
