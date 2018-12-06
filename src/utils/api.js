import request from 'request';

const localeapp = 'https://api.localeapp.com';

/**
 * @description API consumer.
 * @param method
 * @param url
 * @param key
 * @param data
 * @returns {Promise<any>}
 */
function api(method, url, key, data) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${localeapp}/v1/projects/${key}/${url.replace(/^\//, '')}`;
    console.log(`Full url: ${fullUrl}`);
    request({
      method,
      url: fullUrl,
      formData: data ? { file: data } : null,
    }, (error, response, body) => {
      if (error) reject(error);
      else resolve({ response, body });
    });
  });
}

/**
 * @description Pull translations.
 * @param key
 * @returns {Promise<any>}
 */
export function localeappPull(key) {
  return api('GET', '/translations/all.yml', key);
}

/**
 * @description Push translations.
 * @param key
 * @param file
 * @returns {Promise<any>}
 */
export function localeappPush(key, file) {
  return api('POST', '/import', key, file);
}
