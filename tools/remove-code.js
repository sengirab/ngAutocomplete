const del = require('del');

del(['src/app/ng-autocomplete/**/*.ngsummary.json']).then(paths => {
    console.log('Files and folders that would be deleted:\n', paths.join('\n'));
});

del(['src/app/ng-autocomplete/**/*.ngfactory.ts']).then(paths => {
    console.log('Files and folders that would be deleted:\n', paths.join('\n'));
});

del(['src/app/ng-autocomplete/node_modules']);
