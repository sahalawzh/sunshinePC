/*
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-05-25 19:55:45
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-03 23:33:21
 */
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
var path = require('path')


const proxyDefined = process.env.NODE_ENV === 'development' ? {
  '/api': {
    target: 'http://42.194.249.178:8068' || 'http://42.194.249.178/countryBack',
    ws: true,
    changeOrigin: true,  // 允许跨域
    rewrite: path => path.replace(/^\/api/, '')
  }
} : {}
export default ({ mode }) =>  defineConfig({
  plugins: [
    vue(),
    // vitePluginImport([
    //   {
    //     libraryName: 'element-plus',
    //     libraryDirectory: 'es',
    //     style(name) {
    //       return `element-plus/lib/theme-chalk/${name}.css`;
    //     },
    //   }
    // ])
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: proxyDefined
  }
})