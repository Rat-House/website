import { HeaderBuilder } from '$lib/headers.js';

/** @type {import("./$types").PageLoad} */
export async function load() {
  new HeaderBuilder()
    .removeTitleTemplate()
    .setTitle('About RatHouse')
    .setDescription('A website for projects and blogs')
    .save();
}
