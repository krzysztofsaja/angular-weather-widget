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

export enum ForecastMode {
  GRID = <any>'GRID',
  DETAILED = <any>'DETAILED'
}

export enum TemperatureScale {
  CELCIUS = <any>'celcius',
  KELVIN = <any>'kelvin',
  FAHRENHEIT = <any>'fahrenheit'
}

export interface WeatherQueryParams {
  cityId?: number;
  cityName?: string;
  latLng?: {
    lat: number;
    lng: number;
  };
  zipCode?: number;
  units?: TemperatureScale;
  lang?: string;
}
