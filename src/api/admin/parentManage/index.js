import fetch from 'utils/fetch';

/**
 * 分页查询
 * @param query
 */
export function page(query) {
  return fetch({
    url: '/api/kindergarten/user/list',
    method: 'get',
    params: query
  });
}


/**
 * 新增设备
 * @param obj
 */
export function addPerson(obj) {
  return fetch({
    url: '/api/kindergarten/user/add',
    method: 'post',
    data: obj
  });
}
