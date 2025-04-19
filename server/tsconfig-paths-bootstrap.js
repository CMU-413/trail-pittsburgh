import tsConfigPaths from 'tsconfig-paths';

tsConfigPaths.register({
    baseUrl: './dist',
    paths: {
        '@/*': ['*'],
    },
});
