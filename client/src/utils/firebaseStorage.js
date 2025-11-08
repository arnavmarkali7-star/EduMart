import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Upload image to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} folder - Folder path in storage (e.g., 'products', 'avatars')
 * @returns {Promise<string>} - Download URL of uploaded file
 */
export const uploadImageToFirebase = async (file, folder = 'products') => {
  return new Promise((resolve, reject) => {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}_${file.name}`;
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Monitor upload progress
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress tracking (optional)
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Handle error
        console.error('Upload error:', error);
        reject(error);
      },
      () => {
        // Upload completed successfully
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
};

/**
 * Upload multiple images to Firebase Storage
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - Folder path in storage
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadMultipleImagesToFirebase = async (files, folder = 'products') => {
  try {
    const uploadPromises = Array.from(files).map((file) =>
      uploadImageToFirebase(file, folder)
    );
    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

