/*
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-07-03 18:18:05
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-03 22:23:40
 */
import {
  downloadAffairExcel,
  downloadExcelFromSystemUser,
  downloadExcel,
  downloadExcelFromCitizen
} from "@/api/index";

export default function useDownloadTemplate () {
  const handleDownLoad = async (origin) => {
    try {
      let API_PATH = ''
      if (origin === 'systemUser') {
        API_PATH = downloadExcelFromSystemUser
      }
      if (['finance', 'country', 'party'].includes(origin)) {
        API_PATH = downloadAffairExcel
      }
      if (origin === 'countryInfo') {
        API_PATH = downloadExcel
      }
      if (origin === 'citize') {
        API_PATH = downloadExcelFromCitizen
      }
      const res = await API_PATH({}, {responseType: 'blob'})
      let type = res.headers['content-type']
		  let disposition = res.headers['content-disposition']
		  let fileName = disposition.split(';')[1].split('=')[1]
      let blob = new Blob([res.data],{
		    type
      })
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
    } catch (error) {
      console.log('error: ', error);
    }
  }
  return {
    handleDownLoad
  }
}