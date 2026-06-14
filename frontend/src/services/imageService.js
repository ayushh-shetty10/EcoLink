import supabase from '../config/supabaseClient';

function base64ToUint8Array(base64) {
  console.log('[base64ToUint8Array] Starting base64 conversion...');
  const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

  if (typeof Buffer !== 'undefined') {
    console.log('[base64ToUint8Array] Using Buffer implementation');
    return Uint8Array.from(Buffer.from(cleanBase64, 'base64'));
  }

  console.log('[base64ToUint8Array] Buffer not found, using pure JS base64 decoder');
  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup = new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
    }

    let bufferLength = cleanBase64.length * 0.75;
    if (cleanBase64[cleanBase64.length - 1] === '=') {
      bufferLength--;
      if (cleanBase64[cleanBase64.length - 2] === '=') {
        bufferLength--;
      }
    }

    const bytes = new Uint8Array(bufferLength);
    let p = 0;
    for (let i = 0; i < cleanBase64.length; i += 4) {
      const base64code1 = lookup[cleanBase64.charCodeAt(i)];
      const base64code2 = lookup[cleanBase64.charCodeAt(i + 1)];
      const base64code3 = lookup[cleanBase64.charCodeAt(i + 2)];
      const base64code4 = lookup[cleanBase64.charCodeAt(i + 3)];

      bytes[p++] = (base64code1 << 2) | (base64code2 >> 4);
      if (p < bufferLength) {
        bytes[p++] = ((base64code2 & 15) << 4) | (base64code3 >> 2);
      }
      if (p < bufferLength) {
        bytes[p++] = ((base64code3 & 3) << 6) | (base64code4 & 63);
      }
    }
    console.log(`[base64ToUint8Array] Decoded successfully. Output length: ${bytes.length} bytes.`);
    return bytes;
  } catch (err) {
    console.error('[base64ToUint8Array] Pure JS base64 decoder failed:', err);
    throw err;
  }
}

/**
 * Upload image to Supabase Storage (ewaste-images bucket)
 * @param {string} fileName - Filename (e.g., "request-123.jpg")
 * @param {string|{ uri?: string, base64?: string, mimeType?: string }} imageInput - Local image URI or Expo ImagePicker asset data
 * @returns {Promise<{url: string} | {error: any}>}
 */
export async function uploadImageToStorage(fileName, imageInput) {
  try {
    console.log(`[uploadImageToStorage] Upload triggered for filename: ${fileName}`);
    const imageBase64 = typeof imageInput === 'object' ? imageInput?.base64 : null;
    const imageUri = typeof imageInput === 'object' ? imageInput?.uri : imageInput;

    let fileBody;
    let contentType = typeof imageInput === 'object' && imageInput?.mimeType ? imageInput.mimeType : 'image/jpeg';

    if (imageBase64) {
      console.log('[uploadImageToStorage] Image data contains base64 string, decoding...');
      fileBody = base64ToUint8Array(imageBase64);
    } else if (imageUri) {
      console.log(`[uploadImageToStorage] Fetching image content from URI: ${imageUri}`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      fileBody = blob;
      contentType = blob.type || contentType;
    } else {
      console.error('[uploadImageToStorage] No image data or URI provided.');
      return { error: { message: 'No image data provided' } };
    }

    console.log(`[uploadImageToStorage] Uploading to bucket "ewaste-images" with content type: ${contentType}`);
    const { data: uploadData, error } = await supabase.storage.from('ewaste-images').upload(fileName, fileBody, {
      contentType,
      upsert: false,
    });

    if (error) {
      console.error('[uploadImageToStorage] Supabase Storage upload returned error:', error);
      return { error };
    }

    console.log('[uploadImageToStorage] Upload complete. Generating public URL...');
    const { data: publicData } = supabase.storage.from('ewaste-images').getPublicUrl(fileName);
    console.log('[uploadImageToStorage] Generated public URL:', publicData.publicUrl);

    return { url: publicData.publicUrl };
  } catch (error) {
    console.error('[uploadImageToStorage] Unexpected exception caught:', error);
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
