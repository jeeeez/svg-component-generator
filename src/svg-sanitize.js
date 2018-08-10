const sanitizeHtml = require('sanitize-html');

exports.sanitize = function sanitizeSvg(html) {
    const code = sanitizeHtml(html, {
        allowedTags: ['svg', 'defs', 'path'],
        allowedAttributes: {
            svg: ['viewbox'],
            path: ['d']
        }
    });

    return code.replace('viewbox', 'viewBox');
}
