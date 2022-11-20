/***
 * berryParam(sql, req, otherParam)
 * usage: "select * from Table
 *   where id=:userId and name=:loginUser.name
 *      and add in (@addrs)"
 *
 *
 * return {query, queryParam, param ,error}
 *
 * **/
import { extendJson, getValue } from './utils.js';

const REG_PARAMS = /(:@)([a-zA-Z]+)([0-9.a-zA-Z_\\-]*)/g;
export const berryParams = (sql, req, otherParams) => {
  try {
    const params = extendJson(req.body, req.query, req.params, otherParams);
    console.log('*********', params);
    const queryKeys = sql.match(REG_PARAMS);
    const query = sql.replace(REG_PARAMS, '?');
    const queryParams = queryKeys.map((k) => getValue(params, k));
    return { query, queryParams };
  } catch (error) {
    return { error };
  }
};
