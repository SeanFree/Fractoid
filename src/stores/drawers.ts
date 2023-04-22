import { defineStore } from 'pinia'
import visibility from './visibility'

export const useDrawersStore = defineStore('drawers', visibility('drawers'))
