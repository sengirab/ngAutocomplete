import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

    transform(text: string, search: string): string {
        if (search.length > 0) {
            return this.Strip(text).replace(new RegExp(`${this.EscapeMatch(search)}`, 'gi'), (match: string) => {
                return `<span class="dropdown-item-highlight">${match}</span>`;
            });
        } else {
            return text;
        }
    }

    EscapeMatch(match: string) {
        const entityMap = {
            '&': '\\&',
            '<': '\\<',
            '>': '\\>',
            '/': '\\/',
            '=': '\\=',
            '+': '\\+',
            '-': '\\-',
            '#': '\\#',
            '!': '\\!',
            '@': '\\@',
            '$': '\\$',
            '%': '\\%',
            '^': '\\^',
            '*': '\\*',
            '(': '\\(',
            ')': '\\)',
        };

        return String(match).replace(/[&<>"'`=+\/]/g, function (s) {
            return entityMap[s];
        });
    }

    Strip(str_in: String = '') {
        return str_in.replace(/<[^>]*>/g, '');
    }
}
