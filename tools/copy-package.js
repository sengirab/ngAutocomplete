const fs = require('fs');

let publishPackage = fs.readFileSync('publish-package.json').toString();
fs.writeFileSync('dist/package.json', publishPackage);

let readme = fs.readFileSync('README.md').toString();
fs.writeFileSync('dist/README.md', readme);