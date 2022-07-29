<!--
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-06-08 15:29:56
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-04 00:53:37
-->
<template>
  <div class="dweller-container">
    <el-row :gutter="20" class="el-row dweller-section">
      <el-col :span="6" class="town-section">
        <el-input
          class="town-control"
          placeholder="请输入乡镇名称搜索"
          v-model="filterText"
        >
        </el-input>
        <el-tree
          accordion
          :filter-node-method="filterNode"
          ref="tree"
          :load="loadNode"
          lazy
          node-key="id"
          :props="defaultProps"
          class="town-tree"
          highlight-current
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="18">
        <div class="common-container">
          <div class="common-section container">
            <el-row class="mb20" v-if="query.countryId">
              <el-button
                icon="el-icon-circle-plus-outline"
                size="small"
                type="primary"
                @click="handleEdit"
                >{{slideList.length > 0 ? '编辑' : '新增'}}</el-button>
              <el-link style="margin-left: 12px" :underline="false">{{currentItem.label}}</el-link>
            </el-row>
            <div class="common-list" v-if="slideList.length > 0">
              <el-carousel trigger="click" height="300px">
                <el-carousel-item v-for="item in slideList" :key="item.url">
                  <img :src="picLinkPrefix + item.url" alt="">
                </el-carousel-item>
              </el-carousel>
            </div>

            <!-- 编辑弹出框 -->
            <el-dialog title="编辑" v-model="editVisible" width="38%">
              <el-form label-width="110px" :model="form" ref="formRef">
                <el-form-item label="图片上传" prop="picUrls">
                  <el-upload
                    list-type="picture-card"
                    :on-success="handlePicSuccess"
                    :headers="csrfToken"
                    :before-remove="handleRemove"
                    :file-list="form.picUrls"
                    :action="UPLOAD_URL">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-form>
            </el-dialog>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex"
import {UPLOAD_URL} from '@/api/index'
import { listAreaCodeTree, slideShowList, deleteSlideShow, recordSlideShow } from "../api/index";
export default {
  data() {
    return {
      filterText: "",
      partyMemberList: [{
        value: '00',
        name: '群众'
      }, {
        value: '01',
        name: '党员'
      }],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: (data, node) => {
          if (node.level === 2) {
            return true;
          }
        },
      },
    };
  },
  setup() {
    let query = reactive({
      townId: '',
      countryId: ''
    });
    const store = useStore()
    const picLinkPrefix = computed(() => store.state.picLinkPrefix)
    const slideList = ref([]);
    let currentItem = ref({})
    const getCarouselList = async () => {
      try {
        const { data } = await slideShowList(query);
        slideList.value = data.list;
      } catch (error) {
        console.log("error: ", error);
      }
    }
    const handleNodeClick = async (item, node) => {
      currentItem.value = item
      if (node.level === 1) return
      const { id, parentId } = item;
      query.countryId = id,
      query.townId = parentId
      getCarouselList()
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    const formRef = ref(null);
    let form = reactive({
      picUrls: []
    });
    const handleEdit = () => {
      if (!query.countryId) return ElMessage.error("请选择村庄");
      form.picUrls = slideList.value.map((item) => {
        return {name: 'upload', id: item.id, url: picLinkPrefix.value + item.url, submitUrl: item.url}
      })
      editVisible.value = true;
    };
    const saveEdit = () => {
      // formRef.value.validate(async (valid) => {
      //   if (valid) {
      //     const picUrls = form.picUrls.map(item => item.submitUrl)
      //     const opts = {
      //       picUrls,
      //       ...query
      //     }
      //     await recordSlideShow(opts)
      //     editVisible.value = false;
      //     getCarouselList()
      //   }
      // })
    };

    // tree
    const loadNode = async (node, resolve) => {
      if (node.level === 0) {
        const townData = await listAreaCodeTree({
          areaLevel: 5,
        });
        const townList = townData.data.map((item) => {
          item.label = item.areaName;
          return item;
        });
        return resolve(townList);
      }
      if (node.level > 1) return resolve([]);
      const opts = {
        areaLevel: 6,
        parentId: node.data.areaId,
      };
      const res = await listAreaCodeTree(opts);
      let countryList = [];
      res.data.forEach((item) => {
        countryList.push({
          label: item.areaName,
          leaf: true,
          id: item.areaId,
          parentId: item.parentId,
        });
      });
      resolve(countryList);
    };
    
    const handlePicSuccess = async (response, file, fileList) => {
      // newUpload.value.push(response.msg)
      const picUrls = [response.msg]
      const opts = {
        picUrls,
        ...query
      }
      await recordSlideShow(opts)
      editVisible.value = false;
      getCarouselList()
    }
    const handleRemove = async (file, fileList) => {
      if (file.id === 0) {
        ElMessage.error("该图片无法删除");
        return false
      }
      await deleteSlideShow({ id: file.id })
      getCarouselList()
      // 二次确认删除
      // ElMessageBox.confirm("确定要删除吗？", "提示", {
      //   type: "warning",
      // })
      //   .then(async () => {
      //     await deleteSlideShow({ id: file.id })
      //     const delIndex = form.picUrls.findIndex(item => item.id === file.id)
      //     form.picUrls.splice(delIndex, 1)
      //     ElMessage.success("删除成功");
      //   })
      //   .catch(() => {
      //     return false
      //   });
    }
    const csrfToken = ref({})
    try {
      const token = localStorage.getItem('envJwtToken') || ''
      csrfToken.value = {
        'envJwtToken': token || '',
        'X-Requested-With': 'XMLHttpRequest'
      }
    } catch (e) {
      console.log(e)
    }

    return {
      slideList,
      query,
      handleEdit,
      editVisible,
      loadNode,
      form,
      handleNodeClick,
      formRef,
      picLinkPrefix,
      handlePicSuccess,
      csrfToken,
      handleRemove,
      currentItem,
      UPLOAD_URL
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
};
</script>
<style lang="scss" scoped>
.dweller-container {
  padding-left: 12px;
  height: 100%;
  .dweller-section {
    height: 100%;
  }
  .town-section {
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
    .town-tree {
      margin-top: 10px;
    }
    .el-tree-node__children {
      min-height: 120px;
    }
  }
  .common-container {
    height: 100%;
    .common-section {
      height: 100%;
    }
    .mr10 {
      margin-right: 10px;
    }
    .mb20 {
      margin-bottom: 20px;
    }
    .handle-select {
      width: 120px;
    }
    .common-header {
      padding: 20px 30px 0 30px;
      background-color: #fff;
      border-radius: 5px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
    }
  }
  .el-carousel__container img {
    width: 100%;
    height: 100%;
  }
}
</style>
