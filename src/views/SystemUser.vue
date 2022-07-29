<!--
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-06-07 14:40:36
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-28 22:10:09
-->
<template>
  <div class="common-container">
    <div class="common-header">
      <el-row>
        <el-form :inline="true" ref="searchFormRef" :model="searchForm">
          <el-form-item label="账号名称:" prop="username">
            <el-input
              size="small"
              placeholder="请输入账号名称"
              v-model="searchForm.username"
            ></el-input>
          </el-form-item>
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
          <el-form-item label="姓名:" prop="showName">
            <el-input
              size="small"
              placeholder="请输入姓名"
              v-model="searchForm.showName"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="phone">
            <el-input
              size="small"
              placeholder="请输入手机号"
              v-model="searchForm.phone"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色:" prop="searchUserLevel">
            <el-select clearable v-model="searchForm.searchUserLevel" 
              placeholder="请选择所属角色">
              <el-option
                v-for="item in levelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              size="small"
              type="primary"
              @click="submitForm"
              >筛选</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="small"
              @click="resetForm"
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
          >添加</el-button>
        <el-upload
          :on-change="handleFileSuccess"
          ref="upload"
          accept=".xlsx, .xls"
          :show-file-list="false"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">导入</el-button>
        </el-upload>
        <el-button size="small" type="primary" @click="handleExport('systemUser', searchForm)">导出</el-button>
        <el-button size="small" type="primary" @click="handleDownLoad('systemUser')">下载模板</el-button>
      </el-row>
      <div class="common-list">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column prop="username" label="账号名称"> </el-table-column>
          <el-table-column prop="townName" label="所属乡镇"> </el-table-column>
          <el-table-column prop="countryName" label="所属村庄">
          </el-table-column>
          <el-table-column prop="showName" label="姓名"> </el-table-column>
          <el-table-column label="角色">
            <template #default="scope">
            {{getLevelName(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column width="260" label="操作" align="center">
            <template #default="scope">
              <el-button
                size="mini"
                type="info"
                plain
                @click="handleEdit(scope.row)"
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
            :current-page="searchForm.pageNum"
            :page-size="searchForm.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </div>

      <!-- 编辑弹出框 -->
      <el-dialog title="编辑" v-model="editVisible" width="38%">
        <el-form label-width="110px" :model="form" :rules="rules" ref="formRef">
          <el-form-item label="账号名称" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="所属乡镇" prop="townId" :required="true">
            <el-select
              clearable
              v-model="form.townId"
              placeholder="请选择所属乡镇"
              @change="handleChangeTown"
            >
              <el-option
                v-for="item in townList"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属村庄" prop="countryId" :required="true">
            <el-select clearable v-model="form.countryId" 
              placeholder="请选择所属村庄">
              <el-option
                v-for="item in countryList"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="showName">
            <el-input v-model="form.showName"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="userLevel">
            <el-select v-model="form.userLevel" 
              placeholder="请选择所属角色">
              <el-option
                v-for="item in levelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import {
  listSystemUser,
  removeSystemUser,
  listAreaCodeTree,
  editSystemUser
} from "@/api/index";
import useDownloadTemplate from '@/hooks/useDownloadTemplate'
import useImportExport from '@/hooks/useImportExport'
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "commonList",
  setup() {
    const tableData = ref([]);
    const pageTotal = ref(0);
    let searchForm = reactive({
      pageNum: 1,
      pageSize: 10,
      countryName: '',
      townName: '',
      username: '',
      showName: '',
      phone: '',
      searchUserLevel: ''
    });
    // 获取表格数据
    const getData = () => {
      listSystemUser(searchForm).then((res) => {
        const { list, total } = res.data;
        tableData.value = list;
        pageTotal.value = total;
      });
    };
    getData();
    const searchFormRef = ref(null)
    
    const submitForm = () => {
      searchFormRef.value.validate((valid) => {
        if (valid) {
          searchForm.pageNum = 1
          getData()
        }
      });
    };
    const resetForm = () => {
      searchFormRef.value.resetFields()
    };
    // 分页导航
    const handlePageChange = (val) => {
      searchForm.pageNum = val;
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
          removeSystemUser(opts).then(() => {
            ElMessage.success("删除成功");
            getData();
          });
        })
        .catch(() => {});
    };

    // 编辑或新增
    const townList = ref([]);
    const countryList = ref([]);
    const editVisible = ref(false);
    const formRef = ref(null);
    const rules = {
      username: [
        { required: true, message: "请输入账号", trigger: "blur" },
        { required: true, pattern: /^[a-zA-Z][a-zA-Z0-9]{2,15}$/, message: "请输入正确的账号", trigger: "blur" }
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
      ],
      phone: [
        { required: true, message: "请输入手机号", trigger: "blur" },
      ],
      showName: [
        { required: true, message: "请输入姓名", trigger: "blur" },
      ],
      userLevel: [
        { required: true, message: "请选择角色", trigger: "change" },
      ],
    };
    let form = reactive({
      countryId: "",
      countryName: "",
      password: "",
      phone: "",
      showName: "",
      townId: "",
      townName: "",
      userLevel: "",
      username: "",
      id: ''
    });
    const handleEdit = async (row) => {
      const opts = {
        areaLevel: 5,
      };
      const { data } = await listAreaCodeTree(opts)
      if (row) {
        Object.keys(form).forEach((item) => {
          form[item] = row[item];
        })
        const countryOpts = {
          areaLevel: 6,
          parentId: row.townId
        }
        const { data } = await listAreaCodeTree(countryOpts)
        countryList.value = data
      } else {
        Object.keys(form).forEach((item) => {
          form[item] = '';
        })
      }
      townList.value = data;
      editVisible.value = true;
      setTimeout(() => {
        formRef.value.clearValidate()
      }, 10)
    };
    const saveEdit = () => {
      console.log('form: ', form);
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
            await editSystemUser(form)
            editVisible.value = false;
            getData()
          } catch (error) {
            console.log('error: ', error);
          }
        }
      })
    };

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

    // store获取权限列表
    const store = useStore()
    const levelList = computed(() => store.state.levelList)

    // 获取等级
    const getLevelName = (row) => {
      const currentLevel = levelList.value.filter((item) => item.id === row.userLevel)[0]
      return currentLevel.name
    }
    const { handleDownLoad } = useDownloadTemplate()
    const { handleExport, handleImport } = useImportExport()

    const handleFileSuccess = async (item) => {
      handleImport(item, 'systemUser')
    }
    return {
      handleDownLoad,
      tableData,
      searchForm,
      rules,
      submitForm,
      searchFormRef,
      resetForm,
      handleEdit,
      saveEdit,
      editVisible,
      handlePageChange,
      handleDelete,
      pageTotal,
      townList,
      handleChangeTown,
      countryList,
      form,
      formRef,
      levelList,
      getLevelName,
      handleExport,
      handleFileSuccess
    };
  },
};
</script>
<style lang="scss">
.el-upload--text {
  width: auto;
  height: auto;
  border-radius: 0;
  margin: 0 10px;
  overflow: inherit;
  border: none;
}
.common-container {
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
</style>
