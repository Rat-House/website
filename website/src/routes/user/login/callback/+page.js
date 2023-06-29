import {redirect} from "@sveltejs/kit";
import {invalidateAll} from "$app/navigation";
import {browser} from "$app/environment";

/** @type {import('./$types').PageLoad} */
export async function load({data}) {
    if (data.path === "") return

    if (browser) invalidateAll()
    throw redirect(303, data.path)
}
