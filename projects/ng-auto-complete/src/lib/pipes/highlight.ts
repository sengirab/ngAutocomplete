import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
    transform(text: string, search: string): string {
        search = search.trim();

        if (!search) {
            return text;
        }

        return text.replace(new RegExp(search, 'gi'), (match) => `<span class="dropdown-item-highlight">${match}</span>`);
    }
}
