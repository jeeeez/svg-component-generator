const sanitizeHtml = require('sanitize-html');

exports.sanitize = function sanitizeSvg(html, withColor) {
    const code = sanitizeHtml(html, {
        allowedTags: ['svg', 'defs', 'path'],
        allowedAttributes: {
            svg: ['viewbox'],
            path: withColor ? ['d', 'fill', 'opacity'] : ['d', 'opacity']
        }
    });

    return code.replace('viewbox', 'viewBox');
}
