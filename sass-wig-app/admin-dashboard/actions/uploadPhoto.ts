"use server"
import cloudinary from '@/lib/cloudinary'
import { UploadResponse } from '@/types/imageInput'
import { UploadApiResponse } from 'cloudinary'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { v4 } from "uuid"

interface IData {
    filepath: string,
    filename: string
}

//got from patreon
const saveToLocal = async(formData: any) => {
    const files = formData.getAll('files')

    const multipleBuffersPromise = files.map(async (file: File) => {
        const data = await file.arrayBuffer();
        const buffer = Buffer.from(data);
        const name = v4();
        const ext = file.type.split("/")[1];

        const tempdir = os.tmpdir(); // works in vercel 
        const uploadDir = path.join(tempdir, `/${name}.${ext}`);
    
        await fs.writeFile(uploadDir, buffer);
        return { filepath: uploadDir, filename: file.name };
    });
    
    return await Promise.all(multipleBuffersPromise);
}

// each store to have it's own images folder
const uploadToCloudinary = async (newFiles: IData[], storeId: string) => {
    const multiplePhotos = newFiles.map(async (file) => {
        try {
            const result = await cloudinary.uploader.upload(file.filepath, { folder: storeId });
            return result
        } catch (error: any) {
            console.error("Error uploading to Cloudinary:", error.message);
            return null // Return null in case of an error
        }
    });

    return await Promise.all(multiplePhotos);
}

// actual upload function
export const uploadPhoto = async (formData: FormData, storeId: string): Promise<UploadResponse> => {
    try {
        const newFiles = await saveToLocal(formData);
        const photos = await uploadToCloudinary(newFiles, storeId);

        console.log({ photos })

        // Unlink files from tmp directory
        await Promise.all(newFiles.map(file => fs.unlink(file.filepath)));

        // Process uploaded images
        const uploadedImages = photos.map(p => ({
            url: p?.secure_url as string, referenceId: p?.public_id as string
        }));

        return { uploadImages: uploadedImages, err: "" }; // Return a successful response
    } catch (error) {
        if (error instanceof Error) {
            return { uploadImages: [], err: "Something went wrong while uploading image(s)" };
        }
        return { uploadImages: [], err: "An unknown error occurred" };
    }
}

// upload to cloudinary server
export const uploadToCloudinaryServer = async (newFiles: string[], storeId: string ): Promise<(UploadApiResponse | null)[]> => {
  const multiplePhotos = newFiles.map(async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file, { folder: storeId })
      return result
    } catch (error: any) {
      console.error("Error uploading to Cloudinary:", error.message);
      return null; // Return null in case of an error
    }
  });

  return Promise.all(multiplePhotos);
};
