/*
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-05-25 19:55:45
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-03 23:39:31
 */
import request from '../utils/request';

export const UPLOAD_URL = process.env.NODE_ENV === 'development' ? 'api/image/uploadImage' : 'http://42.194.249.178/countryBack/image/uploadImage'
export const IMPORTSYSTEMUSER = process.env.NODE_ENV === 'development' ? 'api/systemUser/importSystemUser' : 'http://42.194.249.178/countryBack/systemUser/importSystemUser'
export const getAffairList = query => {
  return request({
    url: '/affairInfo/listAffairInfo',
    method: 'post',
    data: query
  });
};
export const removeCountryInfo = query => {
  return request({
    url: '/country/removeCountryInfo',
    method: 'post',
    data: query
  });
};
export const getCountryInfo = query => {
  return request({
    url: '/country/getCountryInfo',
    method: 'post',
    data: query
  });
};
export const removeAffairInfo = query => {
  return request({
    url: '/affairInfo/removeAffairInfo',
    method: 'post',
    data: query
  });
};
export const listCountryInfo = query => {
  return request({
    url: '/country/listCountryInfo',
    method: 'post',
    data: query
  });
};
export const listSystemUser = query => {
  return request({
    url: '/systemUser/listSystemUser',
    method: 'post',
    data: query
  });
};
export const getSystemUser = query => {
  return request({
    url: '/systemUser/getSystemUser',
    method: 'post',
    data: query
  });
};
export const removeSystemUser = query => {
  return request({
    url: '/systemUser/removeSystemUser',
    method: 'post',
    data: query
  });
};
export const editSystemUser = query => {
  return request({
    url: '/systemUser/editSystemUser',
    method: 'post',
    data: query
  });
};
export const toLogin = query => {
  return request({
    url: '/login/toLogin',
    method: 'post',
    data: query
  });
};
export const listAreaCodeTree = query => {
  return request({
    url: '/areaCodeTree/listAreaCodeTree',
    method: 'post',
    data: query
  });
};
export const editAreaCodeTree = query => {
  return request({
    url: '/areaCodeTree/editAreaCodeTree',
    method: 'post',
    data: query
  });
};
export const getAffairInfo = query => {
  return request({
    url: '/affairInfo/getAffairInfo',
    method: 'post',
    data: query
  });
};
export const editAffairInfo = query => {
  return request({
    url: '/affairInfo/editAffairInfo',
    method: 'post',
    data: query
  });
};
export const editCountryInfo = query => {
  return request({
    url: '/country/editCountryInfo',
    method: 'post',
    data: query
  });
};
export const listCitizen = query => {
  return request({
    url: '/citizen/listCitizen',
    method: 'post',
    data: query
  });
};
export const editCitizen = query => {
  return request({
    url: '/citizen/editCitizen',
    method: 'post',
    data: query
  });
};
export const removeCitizen = query => {
  return request({
    url: '/citizen/removeCitizen',
    method: 'post',
    data: query
  });
};
export const removeAreaCodeTree = query => {
  return request({
    url: '/areaCodeTree/removeAreaCodeTree',
    method: 'post',
    data: query
  });
};
export const exportAffairInfo = (query, config) => {
  return request({
    url: '/affairInfo/exportAffairInfo',
    method: 'post',
    data: query,
    ...config
  });
};
export const importAffairInfoParty = (query, config) => {
  return request({
    url: '/affairInfo/importAffairInfoParty',
    method: 'post',
    data: query,
    ...config
  });
};
export const importAffairInfoCountry = (query, config) => {
  return request({
    url: '/affairInfo/importAffairInfoCountry',
    method: 'post',
    data: query,
    ...config
  });
};
export const importAffairInfoFinance = (query, config) => {
  return request({
    url: '/affairInfo/importAffairInfoFinance',
    method: 'post',
    data: query,
    ...config
  });
};
export const recordSlideShow = query => {
  return request({
    url: '/image/recordSlideShow',
    method: 'post',
    data: query
  });
};
export const slideShowList = query => {
  return request({
    url: '/image/slideShowList',
    method: 'post',
    data: query
  });
};
export const deleteSlideShow = query => {
  return request({
    url: '/image/deleteSlideShow',
    method: 'post',
    data: query
  });
};
export const getCitizen = query => {
  return request({
    url: '/citizen/getCitizen',
    method: 'post',
    data: query
  });
};
export const downloadAffairExcel = (query, config) => {
  return request({
    url: '/affairInfo/downloadExcel',
    method: 'post',
    data: query,
    ...config
  });
};
export const importCitizen = (query, config) => {
  return request({
    url: '/citizen/importCitizen',
    method: 'post',
    data: query,
    ...config
  });
};
export const exportCitizen = (query, config) => {
  return request({
    url: '/citizen/exportCitizen',
    method: 'post',
    data: query,
    ...config
  });
};
export const exportCountryInfo = (query, config) => {
  return request({
    url: '/country/exportCountryInfo',
    method: 'post',
    data: query,
    ...config
  });
};
export const importCountryInfo = (query, config) => {
  return request({
    url: '/country/importCountryInfo',
    method: 'post',
    data: query,
    ...config
  });
};
export const exportSystemUser = (query, config) => {
  return request({
    url: '/systemUser/exportSystemUser',
    method: 'post',
    data: query,
    ...config
  });
};
export const importSystemUser = (query, config) => {
  return request({
    url: '/systemUser/importSystemUser',
    method: 'post',
    data: query,
    ...config
  });
};
export const downloadExcelFromSystemUser = (query, config) => {
  return request({
    url: '/systemUser/downloadExcel',
    method: 'post',
    data: query,
    ...config
  });
};
export const downloadExcel = (query, config) => {
  return request({
    url: '/country/downloadExcel',
    method: 'post',
    data: query,
    ...config
  });
};
export const downloadExcelFromCitizen = (query, config) => {
  return request({
    url: '/citizen/downloadExcel',
    method: 'post',
    data: query,
    ...config
  });
};
