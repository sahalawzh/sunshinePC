/*
 * @Description:
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-05-25 19:55:45
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-28 21:44:57
 */
import axios from "axios";
import { ElNotification } from 'element-plus'
// axios.defaults.withCredentials = true
const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // baseURL: 'http://42.194.249.178:8068',
  withCredentials: true,
  baseURL: process.env.NODE_ENV === 'development' ? 'http://42.194.249.178:8068' : 'http://42.194.249.178/countryBack',
  timeout: 5000,
});


service.interceptors.request.use(
  (config) => {
    let token = null
    try {
      token = localStorage.getItem('envJwtToken') || ''
    } catch (e) {
      console.log(e)
    }
    config.headers.common["envJwtToken"] = token;
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response) => {
    if (response.status === 200 && response.config.responseType === "blob") {
      return response
    } else if (response.status === 200 && response.data.code === 200) {
      return response.data;
    } else {
      console.log('error: ', response);
      ElNotification({
        title: '温馨提示',
        message: response.data.msg || '接口异常',
        type: 'error',
      })
      return Promise.reject();
    }
  },
  (error) => {
    console.log(error);
    ElNotification({
      title: '温馨提示',
      message: '接口异常',
      type: 'error',
    })
    return Promise.reject();
  }
);

export default service;
