import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export interface Image{
   url: string
}

type ImageState = {
    images: Image[],
    addImage: (img: Image) => void
    deleteImage: (img: Image) => void
}

const imageStore = create<ImageState>()(
    persist((set) => ({
         images: [],
         addImage: (img) => set((state) => ({ ...state, images: [img, ...state.images] })),
         deleteImage: (img) => set((state) => ({ ...state, images: state.images.filter(i => i.url !== img.url )}))
      }), { name: 'images-store'}
    )
)

export default imageStore