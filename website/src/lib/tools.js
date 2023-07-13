import { PUBLIC_POCKETBASE_PAGEURL } from '$env/static/public';

/**
 * @param {import("pocketbase").Record} record
 * @param {string} name
 * @return {string} url
 */
export function getFileUrlFromRecord(record, name) {
  return `${PUBLIC_POCKETBASE_PAGEURL}/api/files/${record.collectionId}/${record.id}/${name}`;
}

/**
 * @param {import("../dbtypes.js").User} user
 * @param {string=}size
 * @return {string} url
 */
export function getAvatarUrl(user, size) {
  if (user.avatar)
    return `${getFileUrlFromRecord(user, user.avatar)}${size ? '?thumb=' + size : ''}`;

  return `http://localhost:5173/dynamic/icon/${user.id}`;
}

/**
 * @param {string} string
 * @return {string}
 */
export function capitaliseOnlyFirst(string) {
  if (string.length < 1) return '';
  return /** @type {string!} */ (string.at(0)).toUpperCase() + string.slice(1).toLowerCase();
}
