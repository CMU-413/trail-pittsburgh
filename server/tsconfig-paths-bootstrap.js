const tsConfigPaths = require('tsconfig-paths');

const tsConfig = require('./tsconfig.json');

const baseUrl = './dist'; // This is where your compiled files are
const cleanup = tsConfigPaths.register({
    baseUrl,
    paths: { '@/*': ['./*'] } // This maps @/* to the dist directory
});
