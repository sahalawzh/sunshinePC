<!--
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-06-07 14:40:36
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-04 01:01:45
-->
<template>
  <div class="common-container">
    <!-- <div class="common-header">
      <el-row>
        <el-form :inline="true" ref="searchFormRef" :model="searchForm">
          <el-form-item label="乡镇名称:" prop="townName">
            <el-input
              size="small"
              placeholder="请输入乡镇名称"
              v-model="searchForm.townName"
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
    </div> -->
    <div class="common-section container">
      <el-row class="mb20">
        <el-button
          icon="el-icon-circle-plus-outline"
          size="small"
          type="primary"
          @click="handleEdit(null)"
          >添加</el-button>
        <!-- <el-button size="small" type="primary">导入</el-button>
        <el-button size="small" type="primary">导出</el-button>
        <el-button size="small" type="primary" @click="handleDownLoad">下载模板</el-button> -->
      </el-row>
      <div class="common-list">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column prop="areaName" label="乡镇名称"> </el-table-column>
          <el-table-column prop="townName" label="乡镇类型">
            <template #default="scope">
              {{ areaTypeMap[scope.row.areaType] }}
            </template>
          </el-table-column>
          <el-table-column prop="editPersonName" label="添加人">
          </el-table-column>
          <el-table-column label="添加时间">
            <template #default="scope">
              {{ processTime(scope.row.createTime) }}
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
                @click="handleDelete(scope.row)"
                size="mini"
                plain
                type="danger"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 编辑弹出框 -->
      <el-dialog title="编辑" v-model="editVisible" width="38%">
        <el-form label-width="110px" :model="form" ref="formRef" :rules="rules">
          <el-form-item label="乡镇id" prop="areaId">
            <el-input v-model="form.areaId" style="width: 180px"></el-input>
            <a target="_blank" href="https://xingzhengquhua.bmcx.com/370923000000__xingzhengquhua/">查看全国行政代码统一查询</a>
          </el-form-item>
          <el-form-item label="乡镇名称" prop="areaName">
            <el-input v-model="form.areaName"></el-input>
          </el-form-item>
          <el-form-item label="乡镇类型" prop="areaType">
            <el-select clearable v-model="form.areaType" 
              placeholder="请选择乡镇类型">
              <el-option
                v-for="(key, value) in areaTypeMap"
                :key="value"
                :label="key"
                :value="value"
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
import useDownloadTemplate from '@/hooks/useDownloadTemplate'
import {
  listAreaCodeTree,
  editAreaCodeTree,
  removeAreaCodeTree
} from "../api/index";
import { getFormatTime } from "@/utils/time";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  name: "commonList",
  data() {
    return {
      areaTypeMap: {
        11: '街道',
        12: '乡',
        13: '镇',
        21: '村'
      }
    };
  },
  setup() {
    const tableData = ref([]);
    const pageTotal = ref(0);
    // 获取表格数据
    const getData = async () => {
      const opts = {
        areaLevel: 5
      }
      const { data } = await listAreaCodeTree(opts)
      pageTotal.value = 12;
      tableData.value = data;
    };
    getData();

    const searchFormRef = ref(null)
    const searchForm = reactive({
      countryName: '',
      townName: '',
      username: '',
      showName: '',
      phone: '',
      searchUserLevel: ''
    });
    const submitForm = () => {
    };
    const resetForm = () => {
      searchFormRef.value.resetFields()
    };

    // 删除操作
    const handleDelete = (item) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          const { id } = item;
          const opts = {
            id,
          };
          removeAreaCodeTree(opts).then(() => {
            ElMessage.success("删除成功");
            getData();
          });
        })
        .catch(() => {});
    };

    // 编辑或新增
    const editVisible = ref(false);
    const formRef = ref(null);
    let form = reactive({
      areaId: "",
      areaName: "",
      areaLevel: '',
      areaType: '',
      id: ''
    });
    const handleEdit = async (row) => {
      if (row) {
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
      }, 10)
    };
    const saveEdit = () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const opts = {
              ...form,
              areaLevel: 5
            }
            await editAreaCodeTree(opts)
            editVisible.value = false;
            getData()
          } catch (error) {
            console.log('error: ', error);
          }
        }
      })
    };

    // store获取权限列表
    const store = useStore()
    const levelList = computed(() => store.state.levelList)

    // 获取等级
    const getLevelName = (row) => {
      const currentLevel = levelList.value.filter((item) => item.id === row.userLevel)[0]
      return currentLevel.name
    }
    // 时间转换
    const processTime = (time) => {
      return getFormatTime(time);
    };
    const rules = {
      areaId: [
        { required: true, message: "请输入乡镇id", trigger: "blur" },
      ],
      areaName: [
        { required: true, message: "请输入乡镇名称", trigger: "blur" },
      ],
      areaType: [
        { required: true, message: "请选择乡镇类型", trigger: "change" },
      ]
    };
    const { handleDownLoad } = useDownloadTemplate()
    return {
      handleDownLoad,
      rules,
      tableData,
      searchForm,
      submitForm,
      searchFormRef,
      resetForm,
      handleEdit,
      saveEdit,
      editVisible,
      handleDelete,
      pageTotal,
      form,
      formRef,
      levelList,
      getLevelName,
      processTime
    };
  },
};
</script>
<style lang="scss" scoped>
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
