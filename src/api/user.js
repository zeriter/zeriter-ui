import request from '@/router/axios';
import {baseUrl} from '@/config/env';
import website from "@/config/website";

// 登录方法
export const loginByUsername = (params) => {
  return request({
    url: '/api/auth/login',
    method: 'post',
    headers: {
      "Content-Type":"application/json;charset=UTF-8",
      'Captcha-Key': params.key,
      'Captcha-Code': params.code,
      isToken: false
    },
    data: {
      ...params,
      grantType: (website.captchaMode ? "captcha" : "password"),
    }
  })
};

export const loginBySocial = (tenantId, source, code, state) => request({
  url: '/api/blade-auth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    source,
    code,
    state,
    grantType: "social",
    scope: "all",
  }
});

export const getButtons = () => request({
  url: '/api/blade-system/menu/buttons',
  method: 'get'
});

export const getUserInfo = () => request({
  url: baseUrl + '/system/user/getInfo',
  method: 'get'
});

export const refreshToken = () => request({
  url: baseUrl + '/auth/refresh',
  method: 'post'
})

export const registerGuest = (form, oauthId) => request({
  url: '/api/blade-user/register-guest',
  method: 'post',
  params: {
    tenantId: form.tenantId,
    name: form.name,
    account: form.account,
    password: form.password,
    oauthId
  }
});

export const getMenu = () => request({
  url: '/api/blade-system/menu/routes',
  method: 'get'
});
// 获取验证码
export const getCaptcha = () => request({
  url: '/api/code',
  method: 'get'
});

export const getTopMenu = () => request({
  url: baseUrl + '/user/getTopMenu',
  method: 'get'
});

export const sendLogs = (list) => request({
  url: baseUrl + '/auth/logout',
  method: 'post',
  data: list
})

export const logout = () => request({
  url: baseUrl + '/auth/logout',
  method: 'get'
})
