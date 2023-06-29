import {PUBLIC_POCKETBASE_PAGEURL} from '$env/static/public'
import PocketBase from 'pocketbase'
import {browser} from "$app/environment";

export const pb = new PocketBase(PUBLIC_POCKETBASE_PAGEURL);
if (browser) pb.authStore.loadFromCookie(document.cookie); // this wont run when using only ssr

