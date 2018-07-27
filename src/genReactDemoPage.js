const { resolvePath, writeFile, readDir } = require('./utils');

function genJSX(components) {
    const result = components.reduce((v, component) => {
        v.imports.push(`import ${component} from '@shuyun-icons/react/${component}';`);
        v.components.push(`<${component} />`);
        return v;
    }, {
        imports: [],
        components: []
    });

    return (`import React from 'react';
import ReactDOM from 'react-dom';
${result.imports.join('\n')}


ReactDOM.render(
    <div>
        ${result.components.join('\n        ')}
    </div>
);`);
}

async function genReactDemoPage() {
    const originalComponents = await readDir(resolvePath(__dirname, '../dist/react/brands'));
    const components = originalComponents.map(item => {
        return item.filename.replace('.jsx', '');
    });

    const jsx = genJSX(components);
    const demoPagePath = resolvePath(__dirname, '../demo/react/index.jsx');
    await writeFile(demoPagePath, jsx);
}


genReactDemoPage();
