import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';


/** @type {import('./$types').LayoutLoad} */
export async function load() {
    const pb = new PocketBase(PUBLIC_POCKETBASE_PAGEURL);
    return {
        pb: pb,
        auth: pb.authStore
    };
}