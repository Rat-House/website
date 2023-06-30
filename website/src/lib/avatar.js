import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';
import { minidenticon } from 'minidenticons';

/**
 * @param {import("../dbtypes.js").User} user
 * @param {string=}size
 * @return {string} url
 */
export function getAvatarUrl(user, size) {
  if (user.avatar)
    return `${PUBLIC_POCKETBASE_PAGEURL}/api/files/${user.collectionId}/${user.id}/${user.avatar}${
      size ? '?thumb=' + size : ''
    }`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(user.id));
}
