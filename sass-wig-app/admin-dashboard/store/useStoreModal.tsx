import { create } from "zustand"

interface IStoreModal {
    isOpen: boolean
    onOpen: ()=> void
    onClose: ()=> void
}

export const useStoreModal = create<IStoreModal>((set) => ({
    isOpen: false,
    onOpen: ()=> set({ isOpen: true }),
    onClose: ()=> set({ isOpen: false })
}))