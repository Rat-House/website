import {redirect} from "@sveltejs/kit";
import {pb} from "$lib/pocketbase.js";

/** @type {import('./$types').PageLoad} */
export async function load() {
    pb.authStore.clear()
    throw redirect(303, '/')
}
