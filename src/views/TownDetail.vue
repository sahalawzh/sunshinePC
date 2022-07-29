<!--
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-06-08 15:29:56
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-04 01:20:19
-->
<template>
  <div class="dweller-container">
    <el-row :gutter="20" class="el-row dweller-section">
      <el-col :span="5" class="town-section">
        <!-- <el-input
          class="town-control"
          placeholder="请输入乡镇名称搜索"
          v-model="filterText"
        >
        </el-input> -->
        <el-tree
          ref="treeVerNew"
          show-checkbox
          node-key="areaId"
          :check-strictly="true"
          @check-change="treeCheckClick"
          :data="townList"
          :props="defaultProps"
          class="town-tree"
        />
      </el-col>
      <el-col :span="19">
        <div class="common-container">
          <!-- <div class="common-header">
            <el-row>
              <el-form :inline="true" :rules="rules" ref="form" :model="form">
                <el-form-item label="乡镇名称:">
                  <el-input
                    size="small"
                    placeholder="请输入乡镇名称"
                    v-model="form.countryName"
                  ></el-input>
                </el-form-item>
                <el-form-item label="村庄名称:">
                  <el-input
                    size="small"
                    placeholder="请输入村庄名称"
                    v-model="form.townName"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    icon="el-icon-search"
                    size="small"
                    type="primary"
                    @click="submitForm('ruleForm')"
                    >筛选</el-button
                  >
                  <el-button
                    icon="el-icon-refresh"
                    size="small"
                    @click="resetForm('ruleForm')"
                    >重置</el-button
                  >
                </el-form-item>
              </el-form>
            </el-row>
          </div> -->
          <div class="common-section container">
            <!-- <el-row class="mb20">
              <el-button
                icon="el-icon-circle-plus-outline"
                size="small"
                type="primary"
                @click="handleEdit(null)"
                >添加</el-button
              >
              <el-button size="small" type="primary">导入</el-button>
              <el-button size="small" type="primary">导出</el-button>
              <el-button size="small" type="primary" @click="handleDownLoad">下载模板</el-button>
            </el-row> -->
            <div class="common-list">
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
              >
                <el-table-column prop="areaName" label="村庄名称">
                </el-table-column>
                <el-table-column label="所属乡镇">
                  <template #default="scope">
                    {{ currentTown.areaName }}
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
                      size="mini"
                      plain
                      type="danger"
                      @click="handleDelete(scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 编辑弹出框 -->
            <el-dialog title="编辑" v-model="editVisible" width="38%">
              <el-form label-width="110px" :model="form" ref="formRef" :rules="rules">
                <el-form-item label="村庄id" prop="areaId">
                  <el-input v-model="form.areaId"></el-input>
                </el-form-item>
                <el-form-item label="村庄名称" prop="areaName">
                  <el-input v-model="form.areaName"></el-input>
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { ref, reactive } from "vue";
import useDownloadTemplate from '@/hooks/useDownloadTemplate'
import { listAreaCodeTree, removeAreaCodeTree, editAreaCodeTree } from "../api/index";
import { getFormatTime } from "@/utils/time";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  data() {
    return {
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  setup() {
    const areaOpts = reactive({
      areaLevel: 5,
    });
    const tableData = ref([]);
    const townList = ref([]);
    // 获取表格数据
    const getData = () => {
      listAreaCodeTree(areaOpts).then((res) => {
        res.data.forEach((item) => {
          item.label = item.areaName;
          item.id = item.areaId;
        });
        townList.value = res.data;
      });
    };
    getData();

    // 勾选
    const treeVerNew = ref(null);
    const currentTown = ref({});
    const treeCheckClick = async (data, checked) => {
      if (currentTown.value.areaId === data.areaId) {
        treeVerNew.value.setCheckedKeys([data.areaId]);
        return 
      }
      if (checked) {
        treeVerNew.value.setCheckedKeys([data.areaId]);
        currentTown.value = data
        getCountryList()
      }
    };

    const getCountryList = async () => {
      try {
        const countryOpts = {
          areaLevel: 6,
          parentId: currentTown.value.areaId,
        };
        const { data: countryList } = await listAreaCodeTree(countryOpts);
        tableData.value = countryList;
      } catch (error) {
        console.log('error: ', error);
      }
    }

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
          removeAreaCodeTree(opts).then((res) => {
            ElMessage.success("删除成功");
            getCountryList();
          });
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    const formRef = ref(null);
    let form = reactive({
      areaId: '',
      areaName: '',
      id: ''
    });
    const handleEdit = (row) => {
      if (!currentTown.value.areaId) return ElMessage.error("请选择乡镇");
      if (row) {
        Object.keys(form).forEach((item) => {
          form[item] = row[item];
        });
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
          const opts = {
            ...form,
            parentId: currentTown.value.areaId,
            areaType: 21,
            areaLevel: 6
          }
          await editAreaCodeTree(opts)
          editVisible.value = false;
          getCountryList()
        }
      })
    };
    // 时间转换
    const processTime = (time) => {
      return getFormatTime(time);
    };
    const rules = {
      areaId: [
        { required: true, message: "请输入村庄id", trigger: "blur" },
      ],
      areaName: [
        { required: true, message: "请输入村庄名称", trigger: "blur" },
      ]
    };
    const { handleDownLoad } = useDownloadTemplate()

    return {
      handleDownLoad,
      rules,
      tableData,
      handleEdit,
      saveEdit,
      editVisible,
      townList,
      treeCheckClick,
      treeVerNew,
      processTime,
      handleDelete,
      form,
      formRef,
      currentTown
    };
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
}
</style>
