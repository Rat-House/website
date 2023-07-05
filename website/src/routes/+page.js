import { HeaderBuilder } from '$lib/headers.js';

/** @type {import("./$types").PageLoad} */
export async function load() {
  new HeaderBuilder()
    .removeTitleTemplate()
    .setTitle('RatHouse')
    .setDescription('A website with stuff and things')
    .save();
}
