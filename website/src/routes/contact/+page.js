import { HeaderBuilder } from '$lib/headers.js';

/** @type {import("./$types").PageLoad} */
export async function load() {
  new HeaderBuilder().setTitle('Contact us').setDescription('Send us a message').save();
}
