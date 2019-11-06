import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'timerDuration'
})
export class TimerDurationPipe implements PipeTransform {

  transform(secs: any, args?: any): any {
    return moment.utc(secs * 1000).format(args ? 'HH:mm:ss' : 'mm:ss');
  }

}
