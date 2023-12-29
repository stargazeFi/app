import { useDispatch as useStoreDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, StoreDispatch } from '@/store'

export const useDispatch: () => StoreDispatch = useStoreDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
