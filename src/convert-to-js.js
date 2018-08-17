const { transform } = require('babel-core');

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';


exports.convertToJs = function convertToJs(code) {
    return transform(code, {
        presets: ['env', 'stage-0', 'react-app'],
        plugins: [
            ['transform-react-jsx']
        ]
    }).code;
}
