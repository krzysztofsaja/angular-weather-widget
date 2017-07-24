import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  CurrentWeather,
  Forecast,
  WeatherApiService
} from './services/api/weather.api.service';
import {
  WeatherLayout,
  WeatherQueryParams,
  WeatherSettings
} from './weather.interfaces';

@Component({
  selector: 'weather-widget',
  changeDetection: ChangeDetectionStrategy.Default,
  styles: [
    `
             :host {
               display: flex;
               position: relative;
               padding: 1em;
               box-sizing: border-box;
               overflow-y: auto;
             }
             .info {
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
               width: 100%;
             }
             .info.wide {
               flex-direction: row;
             }
             .wide .current {
               flex-grow: 0;
             }
             .wide .forecast {
               flex-grow: 1;
             }
             .current {
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
               min-width: 130px;
             }
             .forecast {
               min-width: 200px;
             }
             .current, .forecast {
               padding: 0.5em;
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
    <div *ngIf="currentWeather" class="info" [class.wide]="isWideLayout">
      <div class="current">
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
      </div>
      <div class="forecast">
        <weather-forecast
          *ngIf="settings.showForecast"
          [forecast]="forecast"
          [settings]="settings"
          [mode]="settings.forecastMode"></weather-forecast>
      </div>
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

  @Input() forecast: Forecast[] | null;
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
    if (this._settings.layout) {
      this.isWideLayout = this._settings.layout === WeatherLayout.WIDE;
    }
  }

  get settings(): WeatherSettings {
    return this._settings;
  }

  isWideLayout = false;
  subscriptionCurrentWeather: Subscription;
  subscriptionForecast: Subscription;
  currentWeather$: Observable<CurrentWeather>;
  forecast$: Observable<Forecast[]>;
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

  forecastCall(): Observable<Forecast[]> {
    const params: WeatherQueryParams = Object.assign(
      {},
      this.settings.location,
      { units: this.settings.scale },
      { lang: this.settings.language }
    );
    return this.weatherApi.forecast(params);
  }
}
