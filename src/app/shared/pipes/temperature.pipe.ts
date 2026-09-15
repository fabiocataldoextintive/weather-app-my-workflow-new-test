import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'temperature', standalone: true, pure: true })
export class TemperaturePipe implements PipeTransform {
  transform(value: number, unit: 'C' | 'F' = 'C', decimals = 1): string {
    return `${value.toFixed(decimals)}°${unit}`;
  }
}
