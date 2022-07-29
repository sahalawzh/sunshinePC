<!--
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-06-07 14:40:36
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-28 22:50:47
-->
<template>
  <div class="common-container">
    <div class="common-header">
      <el-row>
        <el-form :inline="true" ref="searchFormRef" :model="searchForm">
          <el-form-item label="乡镇名称:" prop="townName">
            <el-input
              size="small"
              placeholder="请输入乡镇名称"
              v-model="searchForm.townName"
            ></el-input>
          </el-form-item>
          <el-form-item label="村庄名称:" prop="countryName">
            <el-input
              size="small"
              placeholder="请输入村庄名称"
              v-model="searchForm.countryName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              size="small"
              type="primary"
              @click="submitForm()"
              >筛选</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="small"
              @click="resetForm()"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <div class="common-section container">
      <el-row class="mb20">
        <el-button
          icon="el-icon-circle-plus-outline"
          size="small"
          type="primary"
          @click="handleEdit(null)"
          >添加</el-button
        >
        <el-upload
          :on-change="handleFileSuccess"
          ref="upload"
          accept=".xlsx, .xls"
          :show-file-list="false"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">导入</el-button>
        </el-upload>
        <el-button size="small" type="primary" @click="handleExport('countryInfo', searchForm)">导出</el-button>
        <el-button size="small" type="primary" @click="handleDownLoad('countryInfo')">下载模板</el-button>
      </el-row>
      <div class="common-list">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
        >
          <el-table-column prop="countryName" label="村庄名称">
          </el-table-column>
          <el-table-column prop="townName" label="所属乡镇"> </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="220"
            label="村情介绍">
            <template #default="scope">
              <div class="check-detail" @click="handleEdit(scope.row, 'detail')">查看详情</div>
              <!-- <div v-html="scope.row.description"></div> -->
            </template>
          </el-table-column>
          <el-table-column prop="editPersonName" label="添加人">
          </el-table-column>
          <el-table-column prop="createTime" label="添加时间">
          </el-table-column>
          <el-table-column width="260" label="操作" align="center">
            <template #default="scope">
              <el-button
                size="mini"
                type="info"
                plain
                @click="handleEdit(scope.row, 'edit')"
                >编辑
              </el-button>
              <el-button
                @click="handleDelete(scope.$index, scope.row)"
                size="mini"
                plain
                type="danger"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </div>

      <!-- 编辑弹出框 -->
      <el-dialog 
        @opened="showDialog"
        @closed="hideDialog"
        title="编辑" v-model="editVisible" width="38%">
        <el-form label-width="110px" :model="form" ref="formRef" :rules="rules">
          <el-form-item label="所属乡镇" prop="townId">
            <el-select
              v-model="form.townId"
              placeholder="请选择所属乡镇"
              @change="handleChangeTown"
              :disabled="opStatus === 'detail'"
            >
              <el-option
                v-for="item in townList"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="村庄名称" prop="countryId">
            <el-select v-model="form.countryId" 
              :disabled="opStatus === 'detail'"
              placeholder="请选择所属村庄">
              <el-option
                v-for="item in countryList"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="村庄经纬度" required>
            <el-col :span="11">
              <el-form-item prop="longitude">
                <el-input
                  placeholder="请输入经度"
                  v-model="form.longitude"
                  style="width: 100%;">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align:center;">-</el-col>
            <el-col :span="11">
              <el-form-item prop="latitude">
                <el-input
                  placeholder="请输入纬度"
                  v-model="form.latitude"
                  style="width: 100%;">
                </el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="村庄位置" prop="location">
            <el-input
              placeholder="请输入村庄位置"
              v-model="form.location">
            </el-input>
          </el-form-item>
          <el-form-item label="村情介绍" :required="true">
            <div class="mgb20" ref="editor"></div>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSaveEvent">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ref, reactive, computed } from "vue";
import WangEditor from "wangeditor";
import { listCountryInfo, listAreaCodeTree, editCountryInfo, UPLOAD_URL } from "../api/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from "vuex";
import useDownloadTemplate from '@/hooks/useDownloadTemplate'
import useImportExport from '@/hooks/useImportExport'
export default {
  name: "countryListInfo",
  setup() {
    let query = reactive({
      pageIndex: 1,
      pageSize: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    const searchForm = reactive({
      countryName: '',
      townName: ''
    });
    let instance;
    // 获取表格数据
    const getData = () => {
      query = {
        ...query,
        ...searchForm
      }
      listCountryInfo(query).then((res) => {
        const { list, total } = res.data;
        tableData.value = list;
        pageTotal.value = total;
      });
    };
    getData();

    const submitForm = () => {
      searchFormRef.value.validate((valid) => {
        if (valid) {
          getData()
        }
      });
    };
    const resetForm = () => {
      searchFormRef.value.resetFields()
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    // 删除操作
    const handleDelete = (index, item) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          const { countryId, townId, id } = item;
          const opts = {
            countryId,
            townId,
            id,
          };
          removeAffairInfo(opts).then((res) => {
            ElMessage.success("删除成功");
            tableData.value.splice(index, 1);
          });
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    const countryList = ref([]);
    const formRef = ref(null);
    const townList = ref([]);
    let form = reactive({
      countryId: "",
      countryName: "",
      description: "",
      townName: "",
      townId: "",
      id: ""
    });
    let opStatus = ref('')
    const handleEdit = async (row, status) => {
      opStatus.value = status
      const opts = {
        areaLevel: 5,
      };
      const { data } = await listAreaCodeTree(opts)
      townList.value = data;
      if (row) {
        const countryOpts = {
          areaLevel: 6,
          parentId: row.townId,
        };
        const { data } = await listAreaCodeTree(countryOpts);
        countryList.value = data;
        Object.keys(form).forEach((item) => {
          form[item] = row[item];
        })
      } else {
        Object.keys(form).forEach((item) => {
          form[item] = '';
        })
      }
      editVisible.value = true;
      setTimeout(() => {
        formRef.value.clearValidate()
      }, 100)
    };
    const handleSaveEvent = async () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const selectTown = townList.value.filter(item => item.areaId === form.townId)
            if (selectTown.length) {
              form.townName = selectTown[0].areaName
            }
            const selectCountry = countryList.value.filter(item => item.areaId === form.countryId)
            if (selectCountry.length) {
              form.countryName = selectCountry[0].areaName
            }
            content.html = instance.txt.html()
            form.description = content.html
            await editCountryInfo(form)
            editVisible.value = false
            getData()
          } catch (error) {
            console.log('error: ', error);
          }
        }
      })
    };
    const saveEdit = () => {
      editVisible.value = false;
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      Object.keys(form).forEach((item) => {
        tableData.value[idx][item] = form[item];
      });
    };

    // 搜索
    const searchFormRef = ref(null)
    const editor = ref(null);
    const content = reactive({
      html: "",
      text: "",
    });
    const showDialog = () => {
      instance = new WangEditor(editor.value);
      instance.config.zIndex = 1;
      instance.config.uploadImgServer = UPLOAD_URL
      instance.config.uploadFileName = 'file'
      instance.config.excludeMenus = [
        //定义不需要显示的菜单
        "video"
      ];
      instance.config.showLinkImg = false
      instance.config.uploadImgMaxLength = 2
      instance.config.uploadImgHeaders = {
        'envJwtToken': localStorage.getItem('envJwtToken')
      }
      instance.config.uploadImgMaxSize = 5 * 1024 * 1024
      instance.config.uploadImgHooks = {
        customInsert: function(insertImg, result) {
          var url = picLinkPrefix.value + result.msg  //当前result.data.filePath为后端返回的半截路径，如果为全路径 则不用拼
          insertImg(url)
        }
      }
      instance.create()
      instance.txt.html(form.description)
      if (opStatus.value === 'detail') {
        instance.disable()
      }
    }
    const hideDialog = () => {
      instance.destroy();
      instance = null;
    }
    // store获取权限列表
    const store = useStore()
    const picLinkPrefix = computed(() => store.state.picLinkPrefix)

    const rules = {
      townId: [
        { required: true, message: "请选择乡镇", trigger: "change" },
      ],
      countryId: [
        { required: true, message: "请选择所属村庄", trigger: "change" },
      ],
      longitude: [
        { required: true, message: "请输入村庄经度", trigger: "blur" },
        { required: true, pattern: /^[\-\+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$/, message: "请输入正确的经度", trigger: "blur" }
      ],
      latitude: [
        { required: true, message: "村庄纬度", trigger: "blur" },
        { required: true, pattern: /^[\-\+]?((0|([1-8]\d?))(\.\d{1,10})?|90(\.0{1,10})?)$/, message: "请输入正确的纬度", trigger: "blur" }
      ],
      location: [
        { required: true, message: "请输入村庄位置", trigger: "blur" },
        { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
      ],
      description: [
        { required: true, message: "请输入公开内容", trigger: "blur" },
      ]
    };
    const { handleDownLoad } = useDownloadTemplate()
    const { handleExport, handleImport } = useImportExport()
    const handleFileSuccess = async (item) => {
      handleImport(item, 'countryInfo')
    }
    // 根据乡镇获取对应村庄
    const handleChangeTown = async (value) => {
      const opts = {
        areaLevel: 6,
        parentId: value
      };
      form.countryId = ''
      const { data } = await listAreaCodeTree(opts);
      countryList.value = data
    }
    return {
      handleFileSuccess,
      handleChangeTown,
      handleExport,
      handleDownLoad,
      tableData,
      query,
      submitForm,
      resetForm,
      handleEdit,
      saveEdit,
      editVisible,
      handlePageChange,
      handleDelete,
      pageTotal,
      form,
      townList,
      countryList,
      searchForm,
      searchFormRef,
      editor,
      content,
      showDialog,
      hideDialog,
      handleSaveEvent,
      formRef,
      picLinkPrefix,
      rules,
      opStatus
    };
  },
};
</script>
<style lang="scss" scoped>
.common-container {
  /* 表单大小设置 */
  .el-dialog {
    margin: 0 auto !important;
    height: 90%;
    overflow: hidden;
  } 
  .el-dialog__body {
    position: absolute;
    left: 0;
    top: 54px;
    bottom: 70px;
    right: 0;
    padding: 0;
    z-index: 1;
    overflow: hidden;
    overflow-y: auto;
  } 
  /**表单 确定和取消 按钮的位置 */
  .el-dialog__footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
  /* 表单输入框的大小 */
  .el-input {
    width: 80%;
  }

  /* 弹出框滚动条 */
  /* 设置滚动条的样式 */
  /**解决了滚动条之间发生错位的现象 */
  ::-webkit-scrollbar {
    width: 10px !important;
    height: 10px !important;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2); 
    /* 滚动条的颜色 */
    background-color: #e4e4e4; 
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
.el-table__row {
  img {
    width: 60px;
    height: 60px;
  }
}
.check-detail {
  font-size: 14px;
  cursor: pointer;
  color: rgb(32, 160, 255);
}
</style>
