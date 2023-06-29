import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public'
import PocketBase from 'pocketbase'
import { writable } from 'svelte/store'

export const pb = new PocketBase(PUBLIC_POCKETBASE_PAGEURL)

export const currentUser = writable(pb.authStore.model)