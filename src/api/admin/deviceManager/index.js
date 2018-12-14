import fetch from 'utils/fetch';

/**
 * 新增设备
 * @param obj
 */
export function addDevice(obj) {
  return fetch({
    url: '/api/kindergarten/device/add',
    method: 'post',
    data: obj
  });
}


/**
 * 查询有园区的区域属树数据
 */
export function areaOrganizationList() {
  return fetch({
    url: '/api/kindergarten/device/areaOrganizationList',
    method: 'get'
  });
}

/**
 * 分页查询设备
 * @param query
 */
export function page(query) {
  return fetch({
    url: '/api/kindergarten/device/pageDevice',
    method: 'get',
    params: query
  });
}
/**
 * 修改设备
 * @param obj
 */
export function updateDevice(obj) {
  return fetch({
    url: '/api/kindergarten/device/update',
    method: 'put',
    data: obj
  });
}

/**
 * 分页查询设备
 * @param query
 */
// export function page(query) {
//   return fetch({
//     url: '/api/kindergarten/device/list',
//     method: 'get',
//     params: query
//   });
// }
//
// export function deleteDevice(id) {
//   return fetch({
//     url: '/api/kindergarten/device/delete/' + id,
//     method: 'delete'
//   });
// }

