// import cloudinary from "../config/cloudConfig.js";


// export async function uploadToCloudinary(fileBuffer) {
//     try {
//         const result = await new Promise((resolve, reject) => {
//             const uploadStream = cloudinary.uploader.upload_stream(
//                 { resource_type: 'auto', secure: true},
//                 (error, result) => {
//                     if (error) reject(error);
//                     else resolve(result);
//                 }
//             );
//             uploadStream.end(fileBuffer);
//         });
//         console.log(result.secure_url);
//         return result.secure_url; 
//     } catch (error) {
//         console.error('Error uploading to Cloudinary:', error);
//         throw error; 
//     }
// }


import cloudinary from "../config/cloudConfig.js";

/**
 * Uploads a file buffer to Cloudinary and returns the secure URL.
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @returns {Promise<string>} A promise that resolves with the secure URL of the uploaded file.
 */
export async function uploadToCloudinary(fileBuffer) {
    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto', secure: true },
                (error, result) => {
                    if (error) {
                        console.error('Upload error:', error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.end(fileBuffer);
        });
        return result.secure_url; 
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}
