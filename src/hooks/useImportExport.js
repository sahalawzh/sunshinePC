/*
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-07-03 18:18:05
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-28 22:25:29
 */
import {
  importSystemUser,
  exportSystemUser,
  importAffairInfoFinance,
  importAffairInfoCountry,
  importAffairInfoParty,
  exportCountryInfo,
  importCountryInfo,
  exportCitizen
} from "@/api/index";

export default function useImportExport () {
  const handleExport = async (origin, query) => {
    try {
      let APT_PATH = ''
      let data = query
      if (origin === 'systemUser') {
        APT_PATH = exportSystemUser
      }
      if (origin === 'countryInfo') {
        APT_PATH = exportCountryInfo
      }
      if (origin === 'citize') {
        APT_PATH = exportCitizen
      }
      console.log('data: ', data, exportCitizen);
      const res = await APT_PATH(data, {responseType: 'blob'})
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
  const handleImport = async (item, origin) => {
    try {
      let APT_PATH = ''
      if (origin === 'systemUser') {
        APT_PATH = importSystemUser
      }
      if (origin === 'finance') {
        APT_PATH = importAffairInfoFinance
      }
      if (origin === 'country') {
        APT_PATH = importAffairInfoCountry
      }
      if (origin === 'party') {
        APT_PATH = importAffairInfoParty
      }
      if (origin === 'countryInfo') {
        APT_PATH = importCountryInfo
      }
      let formData = new FormData()
      let file = item.raw
      formData.append('file', file)
      await APT_PATH(formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } catch (error) {
      console.log('error: ', error);
    }
  }
  return {
    handleImport,
    handleExport
  }
}