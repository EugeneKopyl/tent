const path = require('path');

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    turbopack: {
        root: __dirname,
    },
};

module.exports = nextConfig;
