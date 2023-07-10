import { HeaderBuilder } from '$lib/headers.js';
import { getAvatarUrl } from '$lib/tools.js';

/** @type {import("./$types").PageLoad} */
export function load({ data }) {
  new HeaderBuilder()
    .setTitle('Editing your profile page')
    .setDescription(`currently editing ${data.user.name}'s profile`)
    .setImage(
      getAvatarUrl(/** @type {import("../../../dbtypes.d").User} */ (data.user)),
      `${data.user.name}'s avatar`
    )
    .save();
  return data;
}
