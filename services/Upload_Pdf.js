import cloudinary from "../config/cloudConfig.js";


export async function uploadToCloudinary(fileBuffer) {
    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto'},
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(fileBuffer);
        });
        console.log(result.url);
        return result.url; 
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error; 
    }
}
