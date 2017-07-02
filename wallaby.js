module.exports = function (wallaby) {
    return {
        files: [
            'src/scripts/**/*.js',
            '!src/scripts/main.js',
        ],

        tests: [
            'tests/spec/**/*test.js'
        ],

        env: {
            type: 'node'
        },

        testFramework: 'mocha',

        compilers: {
            '**/*.js': wallaby.compilers.babel()
        }
    };
};