// @ts-ignore

/* eslint-disable */
import request from '@/utils/request';

// import request from '../../utils/request';

/** 获取当前的用户 GET /api/admin/user */
export async function currentUser(options) {
  let userInfo = {};
  // const { setUserInfo } = useModel('user');

  try {
    // 向server請求用戶數據
    userInfo = await request('/admin/user', {
      method: 'GET',
      ...(options || {}),
    });
    if (userInfo.status_code !== 401) {
      // 將用戶數據存入localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  } catch (error) {
    throw new error();
  }

  return userInfo;
}

/** 退出登录接口 POST /api/auth/logout */
export async function outLogin(options) {
  return request('/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/auth/login */
export async function login(body, options) {
  // return request('/api/login/account', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   data: body,
  //   ...(options || {}),
  // });
  try {
    // 向server請求用戶數據
    const msg = await request('/auth/login', {
      method: 'POST',
      data: body,
      ...(options || {}),
    });
    // 將token存入localStorage
    localStorage.setItem('access_token', msg.access_token);

    return msg;
  } catch (error) {
    throw new error();
  }
}

/** 注冊接口 POST /api/admin/users */
export async function register(body) {
  try {
    // 向server注冊用戶
    return await request('/auth/register', {
      method: 'POST',
      data: {
        ...body,
        password_confirmation: body.password,
        avatar: body.avatar_url,
      },
    });
  } catch (error) {
    console.log(error);
    throw new error();
  }
}

//獲取首頁統計數據
export async function getStat(options) {
  return request('/admin/index', {
    ...(options || {}),
  });
}

//獲取用戶列表數據
export async function getUserList(options) {
  return request('/admin/users', { params: options });
}

//是否锁定用户
export async function setIsLocked(uid) {
  return request.patch(`/admin/users/${uid}/lock`);
}

//更新用户数据
export async function updateUser(data) {
  return request.put(`/admin/users/${data.id}`, { data });
}

//获取商品列表数据
export async function getGoodsList(params) {
  return request('/admin/goods', { params });
}

//商品是否上架
export async function setIsOn(gid) {
  return request.patch(`/admin/goods/${gid}/on`);
}

//商品是否推荐
export async function setIsRecommend(gid) {
  return request.patch(`/admin/goods/${gid}/recommend`);
}

//获取分类列表数据
export async function getTypeList(params) {
  return request('/admin/category?type=all', { ...params });
}

//更新商品数据
export async function updateGoods(data) {
  const temp = {
    ...data,
    pics: [],
  };
  return request.put(`/admin/goods/${data.id}`, { data: temp });
}

//新增商品数据
export async function addGoods(data) {
  return request.post(`/admin/goods`, { data });
}

//获取OSS Config
export async function getOSSConfig() {
  return request('/auth/oss/token');
}
