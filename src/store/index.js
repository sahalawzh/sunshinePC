/*
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-05-25 19:55:45
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-03 13:20:16
 */
import { createStore } from "vuex";

export default createStore({
  state: {
    levelList: [{
      id: 4,
      name: '县级'
    },{
      id: 5,
      name: '镇级'
    },{
      id: 6,
      name: '村级'
    }],
    tagsList: [],
    collapse: false,
    picLinkPrefix: 'https://dongping-product.oss-cn-qingdao.aliyuncs.com/' || 'https://test0514.oss-cn-guangzhou.aliyuncs.com/',
  },
  mutations: {
    delTagsItem(state, data) {
      state.tagsList.splice(data.index, 1);
    },
    setTagsItem(state, data) {
      state.tagsList.push(data);
    },
    clearTags(state) {
      state.tagsList = [];
    },
    closeTagsOther(state, data) {
      state.tagsList = data;
    },
    closeCurrentTag(state, data) {
      for (let i = 0, len = state.tagsList.length; i < len; i++) {
        const item = state.tagsList[i];
        if (item.path === data.$route.fullPath) {
          if (i < len - 1) {
            data.$router.push(state.tagsList[i + 1].path);
          } else if (i > 0) {
            data.$router.push(state.tagsList[i - 1].path);
          } else {
            data.$router.push("/");
          }
          state.tagsList.splice(i, 1);
          break;
        }
      }
    },
    // 侧边栏折叠
    handleCollapse(state, data) {
      state.collapse = data;
    },
  },
  actions: {},
  modules: {},
});
