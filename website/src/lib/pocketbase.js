import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';
import PocketBase from 'pocketbase';

export const pb = new PocketBase(PUBLIC_POCKETBASE_PAGEURL);
