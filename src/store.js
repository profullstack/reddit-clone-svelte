import { writable } from 'svelte/store'
import decode from 'jwt-decode'

let payload

const token = localStorage.getItem('token')

if (token) {
  try {
    payload = decode(token).user
  } catch (error) {
    console.log(error)
  }
}

export const userStore = writable(payload)

export const categories = writable({})

export const showOverlay = writable(false)

export const currentCategory = writable()
