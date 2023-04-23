import { floor, rand } from '@/utils'

export const sample = (arr: any[]) => arr[floor(rand(arr.length))]
