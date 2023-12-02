import { create } from "zustand"

type IWorkerState = {
    worker: null | ServiceWorkerRegistration
    updateWorker: (data: ServiceWorkerRegistration) => void
}

const serviceWorkerStore = create<IWorkerState>()((set) => (
    {
        worker: null,
        updateWorker: (data) => {
          set((state: IWorkerState) => ({ ...state, worker: data }))
        }
    })
)

export default serviceWorkerStore
