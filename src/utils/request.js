import { extend } from 'umi-request';
import { message, notification } from 'antd';
import { StaticRouter } from 'umi';

// 錯誤代碼信息
const codeMessage = {
  200: '（成功）服务器已成功处理了请求。',
  201: '（已创建）请求成功并且服务器创建了新的资源。',
  204: '（无内容）服务器成功处理了请求，但没有返回任何内容。',
  301: '（永久移动）请求的网页已永久移动到新位置。',
  302: '（临时移动）服务器目前从不同的位置响应请求。',
  400: '（错误请求）服务器不理解请求的语法。',
  401: '（未授权）请求要求身份验证。',
  403: '（禁止）无权限, 服务器拒绝请求。',
  404: '（未找到） 服务器找不到请求的资源',
  408: '（超时） 请求超时',
  422: '（验证错误） 请求参数未通过验证',
  429: '（被限制）请求次数过多',
  500: '（服务器内部错误）  服务器遇到错误，无法完成请求。',
  501: '（尚未实施） 服务器不具备完成请求的功能。',
  502: '（错误网关） 服务器作为网关或代理，从上游服务器收到无效响应。',
  503: '（服务不可用） 服务器目前无法使用（由于超载或停机维护）。 通常，这只是暂时状态。',
  504: '（网关超时）  服务器作为网关或代理，但是没有及时从上游服务器收到请求。',
  505: '（HTTP 版本不受支持） 服务器不支持请求中所用的 HTTP 协议版本。',
};

// 創建request實例對象
const request = extend({
  credential: 'include', //默認請求是否帶上cookie
  prefix: '/api', //發送請求時默認帶上前綴/api
});

// request攔截器
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('access_token') || '';
  // 添加相關認證到headers中
  const headers = { Authorization: `Bearer ${token}` };

  return {
    url,
    options: { ...options, headers },
  };
});
// response攔截器;
request.interceptors.response.use(async (response) => {
  // 異常處理程序，自定義錯誤提示
  const { status } = response;
  if (status === 204 || status === 201) return;
  const result = (await response?.json?.()) || {};
  let err = '';
  // 422異常處理程序
  if (status >= 400 && status <= 1000) {
    if (status === 422) {
      for (const key in result.errors) err += result.errors[key];

      notification.error({
        message: status,
        description: codeMessage[status] + `---[ ${err} ]`,
      });
      return result;
    }

    // 400錯誤異常處理程序
    if (status === 400) {
      err += result.message;
      notification.error({
        message: status,
        description: codeMessage[status] + `---[ ${err} ]`,
      });
      return result;
    }

    //默認錯誤彈窗提示
    notification.error({
      message: response.status,
      description: codeMessage[response.status],
    });
    return result;
  }

  //默認成功彈窗提示
  notification.success({
    message: response.status,
    description: codeMessage[response.status],
  });

  return result;
});

export default request;
