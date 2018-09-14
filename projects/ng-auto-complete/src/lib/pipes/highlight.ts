import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
    transform(text: string, search: string): string {
        if (typeof search === 'undefined') {
            return text
        }

        let pattern = search.replace(/[\-\[\]\/{}()*+?.\\^$|]/g, '\\$&');
        pattern = pattern.split(' ').filter((t) => t.length > 0).join('|');

        /**
         *
         */
        return text.replace(new RegExp(pattern, 'gi'), (match) => `<span class="dropdown-item-highlight">${match}</span>`);
    }
}