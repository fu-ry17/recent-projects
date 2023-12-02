import axios, { AxiosResponse } from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string
const API_URL = 'https://api.remove.bg/v1.0/removebg'

export async function removeBackground(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image_file', file);
  formData.append('size', 'regular');

  try {
    const response: AxiosResponse<ArrayBuffer> = await axios.post(API_URL, formData, {
      headers: {
        'X-Api-Key': API_KEY,
      },
      responseType: 'arraybuffer', // Set the response type to 'arraybuffer' to ensure the correct data type
    });

    const base64Data = arrayBufferToBase64(response.data);
    return `data:image/png;base64,${base64Data}`;
  } catch (error) {
    throw new Error('Failed to remove the background. Please try again later.');
  }
}

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
