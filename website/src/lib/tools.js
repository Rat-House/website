import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';

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

  return `http://localhost:5173/dynamic/icon/${user.id}`;
}

/**
 * @param {string} string
 * @return {string}
 */
export function capitaliseOnlyFirst(string) {
  return string.at(0).toUpperCase() + string.slice(1).toLowerCase();
}
