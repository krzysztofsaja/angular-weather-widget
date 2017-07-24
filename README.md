# Angular Weather Widget
[![Build Status](https://travis-ci.org/krzysztofsaja/angular-weather-widget.svg?branch=master)](https://travis-ci.org/krzysztofsaja/angular-weather-widget)
[![codecov](https://codecov.io/gh/krzysztofsaja/angular-weather-widget/branch/master/graph/badge.svg)](https://codecov.io/gh/krzysztofsaja/angular-weather-widget)
[![npm version](https://badge.fury.io/js/angular-weather-widget.svg)](http://badge.fury.io/js/angular-weather-widget)
[![devDependency Status](https://david-dm.org/krzysztofsaja/angular-weather-widget/dev-status.svg)](https://david-dm.org/krzysztofsaja/angular-weather-widget?type=dev)
[![GitHub issues](https://img.shields.io/github/issues/krzysztofsaja/angular-weather-widget.svg)](https://github.com/krzysztofsaja/angular-weather-widget/issues)
[![GitHub stars](https://img.shields.io/github/stars/krzysztofsaja/angular-weather-widget.svg)](https://github.com/krzysztofsaja/angular-weather-widget/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/krzysztofsaja/angular-weather-widget/master/LICENSE)

## Demo
https://krzysztofsaja.github.io/angular-weather-widget/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#license)

## About

Weather Widget based on Open Weather Map Api

## Installation

Install through npm:
```
npm install --save angular-weather-widget
```

Then include in your apps module:

```typescript
import { Component, NgModule } from '@angular/core';
import { AngularWeatherWidgetModule, WeatherApiName } from 'angular-weather-widget';

@NgModule({
  imports: [
        AngularWeatherWidgetModule.forRoot({
          key: OPEN_WEATHER_MAP_API_KEY,
          name: WeatherApiName.OPEN_WEATHER_MAP,
          baseUrl: 'http://api.openweathermap.org/data/2.5'
        })
  ]
})
export class MyModule {}
```
## Configuration

Use in one of your apps components:
```typescript
import { Component } from '@angular/core';
import { WeatherSettings, TemperatureScale, ForecastMode, WeatherLayout } from 'angular-weather-widget';


@Component({
  template: '<weather-widget [settings]="settings"></weather-widget>'
})
export class MyComponent {
    settings: WeatherSettings = {
      location: {
        cityName: 'Szczecin'
      },
      backgroundColor: '#347c57',
      color: '#ffffff',
      width: '300px',
      height: 'auto',
      showWind: false,
      scale: TemperatureScale.CELCIUS,
      forecastMode: ForecastMode.DETAILED,
      showDetails: false,
      showForecast: true,
      layout: WeatherLayout.WIDE,
      language: 'en'
    };
}
```

If you set proper OPEN_WEATHER_MAP_API_KEY key, data will be retrived from Open Weather Map Api. However, you can also pass relevant information from parent component, eg.

```typescript
import { Component } from '@angular/core';
import { WeatherSettings, TemperatureScale, ForecastMode } from 'angular-weather-widget';


@Component({
  template: '<weather-widget [currentWeather]=currentWeather [forecast]=forecast  [settings]="settings"></weather-widget>'
})
export class MyComponent {
  currentWeather: CurrentWeather = CURRENT_WATHER_MOCK;
  forecast: Forecast[] = FORECAST_MOCK;
  settings: WeatherSettings = {
  location: {
    cityName: 'Szczecin'
  }
};  
}
```

You may also find it useful to view the [demo source](https://github.com/krzysztofsaja/angular-weather/blob/master/demo/demo.component.ts).
You may also find it useful to view the [demo source](https://github.com/krzysztofsaja/angular-weather-widget/blob/master/demo/demo.component.ts).

### Usage without a module bundler
```
<script src="node_modules/angular-weather-widget/bundles/angular-weather-widget.umd.js"></script>
<script>
    // everything is exported angularWeatherWidget namespace
</script>
```

## Documentation
All documentation is auto-generated from the source via [compodoc](https://compodoc.github.io/compodoc/) and can be viewed here:
https://krzysztofsaja.github.io/angular-weather-widget/docs/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and [yarn](https://yarnpkg.com/en/docs/install)
* Install local dev dependencies: `yarn` while current directory is this repo

### Development server
Run `yarn start` to start a development server on port 8000 with auto reload + tests.

### Testing
Run `yarn test` to run tests once or `yarn run test:watch` to continually run tests.

### Release
* Bump the version in package.json (once the module hits 1.0 this will become automatic)
```bash
yarn run release
```

## License

MIT
