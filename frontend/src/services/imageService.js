import supabase from '../config/supabaseClient';

function base64ToUint8Array(base64) {
  const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

  if (typeof Buffer !== 'undefined') {
    return Uint8Array.from(Buffer.from(cleanBase64, 'base64'));
  }

  const binaryString = global.atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);

  for (let index = 0; index < binaryString.length; index += 1) {
    bytes[index] = binaryString.charCodeAt(index);
  }

  return bytes;
}

/**
 * Upload image to Supabase Storage (ewaste-images bucket)
 * @param {string} fileName - Filename (e.g., "request-123.jpg")
 * @param {string|{ uri?: string, base64?: string, mimeType?: string }} imageInput - Local image URI or Expo ImagePicker asset data
 * @returns {Promise<{url: string} | {error: any}>}
 */
export async function uploadImageToStorage(fileName, imageInput) {
  try {
    const imageBase64 = typeof imageInput === 'object' ? imageInput?.base64 : null;
    const imageUri = typeof imageInput === 'object' ? imageInput?.uri : imageInput;

    let fileBody;
    let contentType = typeof imageInput === 'object' && imageInput?.mimeType ? imageInput.mimeType : 'image/jpeg';

    if (imageBase64) {
      fileBody = base64ToUint8Array(imageBase64);
    } else if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      fileBody = blob;
      contentType = blob.type || contentType;
    } else {
      return { error: { message: 'No image data provided' } };
    }

    const { error } = await supabase.storage.from('ewaste-images').upload(fileName, fileBody, {
      contentType,
      upsert: false,
    });

    if (error) {
      return { error };
    }

    const { data: publicData } = supabase.storage.from('ewaste-images').getPublicUrl(fileName);

    return { url: publicData.publicUrl };
  } catch (error) {
    return { error };
  }
}

/**
 * Generate unique filename for image
 * @param {string} userId - User ID
 * @param {string} timestamp - Timestamp
 * @returns {string}
 */
export function generateImageFileName(userId, timestamp = Date.now()) {
  const random = Math.random().toString(36).substring(7);
  return `${userId}-${timestamp}-${random}.jpg`;
}

/**
 * Delete image from storage
 * @param {string} filePath - File path (e.g., "request-123.jpg")
 * @returns {Promise<{success: boolean} | {error: any}>}
 */
export async function deleteImageFromStorage(filePath) {
  try {
    const { error } = await supabase.storage.from('ewaste-images').remove([filePath]);
    if (error) return { error };
    return { success: true };
  } catch (error) {
    return { error };
  }
}

/**
 * Update pickup request image URL
 * @param {string} requestId - Request ID
 * @param {string} imageUrl - Public image URL from storage
 * @returns {Promise<{data} | {error}>}
 */
export async function updatePickupRequestImage(requestId, imageUrl) {
  try {
    const { data, error } = await supabase
      .from('pickup_requests')
      .update({ image_url: imageUrl })
      .eq('id', requestId)
      .select()
      .single();

    if (error) return { error };
    return { data };
  } catch (error) {
    return { error };
  }
}

export default {
  uploadImageToStorage,
  generateImageFileName,
  deleteImageFromStorage,
  updatePickupRequestImage,
};
