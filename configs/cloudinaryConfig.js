/* Configuration file for cloudinary, a third party system
    to manage the uploading of images */

const cloudinary = require('cloudinary');

module.exports = function(cloudinary) {

    cloudinary.config({
        cloud_name: 'doqmhezq7',
        api_key: '434575267517126',
        api_secret: '3nrV3IIfVLoVH27qE3xq1zC_e1U'
    });
}
