import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keys'
})
export class KeyValuePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let keys = [];
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        return keys;
    }
}
