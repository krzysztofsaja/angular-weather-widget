import { Injectable } from '@angular/core';
import { Forecast } from './api/weather.api.service';
import { ChartData } from 'chart.js';

@Injectable()
export class WeatherHelpersService {
  constructor() {}

  groupForecastsByDay(list: Forecast[]): Array<Forecast[]> {
    const map: { [key: string]: Forecast[] } = {};
    let result: Array<Forecast[]> = [];
    list.forEach(el => {
      const day = el.data.getUTCDate();
      if (!map[day]) {
        map[day] = [el];
      } else {
        map[day].push(el);
      }
    });
    result = Object.keys(map).map(key => map[key]);
    return result;
  }

  // Fixme: This function generates wrong icon for average day weather.
  // Weather icon is taken from first day measurement
  reduceToAveragePerDay(list: Forecast[]) {
    return list.reduce((prev: Forecast[], curr) => {
      if (curr && !curr.data) {
        prev.push(curr);
        return prev;
      }
      const lastElement = function() {
        return prev[prev.length - 1];
      };
      const prevDay = lastElement()
        ? prev[prev.length - 1].data.getDay()
        : null;
      const currDay = curr.data.getDay();
      if (currDay === prevDay) {
        const result: Forecast = lastElement();
        result.temp = (result.temp + curr.temp) / 2;
        if (result.wind && curr.wind) {
          result.wind = {
            speed: (result.wind.speed + curr.wind.speed) / 2,
            deg: (result.wind.deg + curr.wind.deg) / 2
          };
        }

        if (result.humidity && curr.humidity) {
          result.humidity = (result.humidity + curr.humidity) / 2;
        }
        if (result.pressure && curr.pressure) {
          result.pressure = (result.pressure + curr.pressure) / 2;
        }

        prev[prev.length - 1] = result;
        return prev;
      } else {
        prev.push(curr);
        return prev;
      }
    }, []);
  }

  mapForecastToCharts(forecast: Forecast[], borderColor = '#aaa'): ChartData {
    return forecast.reduce(
      (prev: ChartData, curr: Forecast) => {
        if (prev.labels) {
          prev.labels.push(curr.data.toISOString());
        }
        if (prev.datasets && prev.datasets[0] && prev.datasets[0].data) {
          const data: number[] = <number[]>prev.datasets[0].data;
          data.push(curr.temp);
        }

        return prev;
      },
      <ChartData>{
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ['rgba(0, 0, 0, 0.1)'],
            borderColor: [borderColor],
            borderWidth: 1
          }
        ]
      }
    );
  }

  hexToRgbA(hex: string, opacity: string) {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(
        ','
      )},${opacity})`;
    }
  }
}
