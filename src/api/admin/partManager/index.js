import fetch from 'utils/fetch';
/**
 * 查询园区树列表数据
 */
export function createAreaTree() {
  return fetch({
    url: '/api/kindergarten/part/createAreaTree',
    method: 'get'
  });
}

/**
 * 分页查询当前节点所有学校数据
 * @param query
 */
export function page(query) {
  return fetch({
    url: '/api/kindergarten/part/list',
    method: 'get',
    params: query
  });
}
export function pageSchool(query) {
  return fetch({
    url: '/api/kindergarten/part/pageSchool',
    method: 'get',
    params: query
  });
}
/**
 * 查询有园区的区域属树数据
 */
export function areaSchoolList() {
  return fetch({
    url: '/api/kindergarten/part/areaSchoolList',
    method: 'get'
  });
}

/**
 * 新增园区
 * @param obj
 */
export function addPart(obj) {
  return fetch({
    url: '/api/kindergarten/part/add',
    method: 'post',
    data: obj
  });
}

/**
 * 新增区域节点
 * @param obj
 */
export function updateAreaNode(obj) {
  return fetch({
    url: '/api/kindergarten/area/update',
    method: 'put',
    data: obj
  });
}
/**
 * 删除区域节点
 * @param obj
 */
export function deleteAreaNode(id) {
  return fetch({
    url: '/api/kindergarten/area/updateToZero/' + id,
    method: 'delete',
  });
}


/**
 * 编辑园区
 * @param obj
 */
export function updatePart(obj) {
  return fetch({
    url: '/api/kindergarten/part/update',
    method: 'put',
    data: obj
  });
}

/**
 * 删除园区
 * @param id
 */
export function deletePart(id) {
  return fetch({
    url: '/api/kindergarten/part/' + id,
    method: 'delete'
  });
}

/**
 * 查询所有的院长用户
 */
export function schoolUser() {
  return fetch({
    url: '/api/kindergarten/part/schoolUser',
    method: 'get'
  });
}

/**
 * 新增班级
 * @param obj
 */
export function addClass(obj) {
  return fetch({
    url: '/api/kindergarten/class/add',
    method: 'post',
    data: obj
  });
}


/**
 * 通过园区ID查询班级
 */
export function queryClass(id) {
  return fetch({
    url: '/api/kindergarten/class/queryClass/' + id,
    method: 'get'
  });
}

/**
 * 删除班级
 * @param id
 */
export function deleteClass(id) {
  return fetch({
    url: '/api/kindergarten/class/delete/' + id,
    method: 'delete'
  });
}

/**
 * 编辑班级
 * @param obj
 */
export function updateClass(obj) {
  return fetch({
    url: '/api/kindergarten/class/update',
    method: 'put',
    data: obj
  });
}

/**
 *查询所有学校及其班级列表树
 */
export function schoolList() {
  return fetch({
    url: '/api/kindergarten/student/schoolList',
    method: 'get'
  });
}

/**
 *根据学校ID查询学校
 */
export function getSchool(id) {
  return fetch({
    url: '/api/kindergarten/part/' + id,
    method: 'get'
  });
}
