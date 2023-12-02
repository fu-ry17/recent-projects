

export interface ImageInput {
    url: string
    referenceId: string
}


export interface UploadResponse{
   uploadImages: ImageInput[],
   err: string
}
