const { v2: cloudinary } = require('cloudinary')
const fs = require('node:fs');
const path = require('node:path');
require('dotenv/config')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadOnCloudinary(inputPathOrUrl) {
    try {
        if (!inputPathOrUrl) return null;
        const absolutePath = path.resolve(inputPathOrUrl);

        // Check if file exists
        if (!fs.existsSync(absolutePath)) {
            console.error('File does not exist:', absolutePath);
            return null;
        }

        const response = await cloudinary.uploader.upload(absolutePath, { folder:"Chat Hub", resource_type: 'auto' })
       
        return response
    } catch (error) {
        console.error("Error uploading to Cloudinary: ", error);
        return null
    } finally {
        fs.unlinkSync(inputPathOrUrl);
    }
}

async function deleteFromCloudinary(url, resourceType = 'image') {
    const cloudinaryPattern = /^https?:\/\/(?:res\.cloudinary\.com|.*\.cloudinary\.com)\//;
    if(!cloudinaryPattern.test(url)) return
    try {
        // Extract public_id from the URL
        const regex = /\/upload\/v\d+\/(.+?)(\.[a-zA-Z]+)?$/;
        const match = url.match(regex);

        if (!match || !match[1]) {
            throw new Error('Invalid Cloudinary URL. Unable to extract public_id.');
        }

        const publicId = match[1];

        // Delete the asset
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

        return result;

    } catch (error) {
        console.error('Error deleting Cloudinary asset:', error.message);
        throw error;
    }
}

module.exports = { uploadOnCloudinary, deleteFromCloudinary }