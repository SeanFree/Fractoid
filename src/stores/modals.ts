import { defineStore } from 'pinia'
import visibility from './visibility'

export const useModalsStore = defineStore('modals', visibility('modals'))
