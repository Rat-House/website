import { HeaderBuilder } from '$lib/headers.js';

export const prerender = true;

/** @type {import("./$types").PageLoad} */
export async function load() {
  new HeaderBuilder()
    .setTitle('About RatHouse')
    .removeTitleTemplate()
    .setDescription('A website for projects and blogs')
    .save();
}
