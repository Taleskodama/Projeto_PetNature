import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique',
  pure: false, // Permite atualizações reativas
})
export class UniquePipe implements PipeTransform {
  transform(value: any[], key: string): any[] {
    if (!value || !key) return value;
    
    return value.filter(
      (obj, index, self) =>
        index === self.findIndex((el) => el[key] === obj[key])
    );
  }
}
