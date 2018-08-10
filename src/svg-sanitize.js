const sanitizeHtml = require('sanitize-html');

exports.sanitize = async function sanitizeSvg(html) {
    const code = sanitizeHtml(html, {
        allowedTags: ['svg', 'defs', 'path'],
        allowedAttributes: {
            svg: ['viewbox'],
            path: ['d']
        }
    });

    return code;
}

