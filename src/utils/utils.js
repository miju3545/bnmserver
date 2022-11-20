import {pbkdf2Sync} from "crypto";

/**
 * usage: extendJson({id:1}, {name: 'Hong'})
 * @param  {...Object} args
 * @return {id:1, name: 'Hong'}
 */

export const extendJson = (...args) => {
  const result = {};
  args.forEach((j) => {
    for (const [k, v] of Object.entries(j || {})) result[k] = v;
  });
  return result;
};

/**
 * usage: getValue({id:1, user: {name: 'Hong'}}, 'user.name')
 * @param {Object} obj
 * @param {string} accessor
 * @return {unknown} value
 */

export const getValue = (obj, accessor) => {
  const pointIdx = accessor.indexOf('.');
  if (pointIdx === -1) return obj[accessor];
  const k = accessor.substring(0, pointIdx);
  return getValue(obj[k], accessor.substring(pointIdx + 1));
};

// TODO make test!!
// const j1 = { id: 1, bbb: 'str', cc: { dd: 'aa' } };
// const j2 = { id: 2, ddd: 'str', cc: { ee: 'xx' } };
// console.log(extendJson(j1, j2));
// console.log(j1);
// console.log(j2);
// console.log(getValue(j1, 'bbb'));
// console.log(getValue(j1, 'cc.dd'));

/**
 * @params {string} passwd
 * @params {Buffer} salt
 **/

const pbkdf2 = (passwd, salt = DefaultSalt)  => pbkdf2Sync(data, salt, 100000, 128, "sha512")