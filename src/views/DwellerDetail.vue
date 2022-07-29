<!--
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-06-08 15:29:56
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-28 22:43:27
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
          <div class="common-header">
            <el-row>
              <el-form :inline="true" ref="searchFormRef" :model="query">
                <el-form-item label="姓名:" prop="showName">
                  <el-input
                    size="small"
                    placeholder="请输入姓名"
                    v-model="query.showName"
                  ></el-input>
                </el-form-item>
                <el-form-item label="政治面貌:" prop="isPartyMember">
                  <el-select
                    v-model="query.isPartyMember"
                    placeholder="请选择政治面貌"
                  >
                    <el-option
                      v-for="item in partyMemberList"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
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
        <el-button size="small" type="primary" @click="handleToExport('citize')">导出</el-button>
        <el-button size="small" type="primary" @click="handleDownLoad('citize')">下载模板</el-button>
            </el-row>
            <div class="common-list">
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
              >
                <el-table-column prop="showName" label="姓名">
                </el-table-column>
                <el-table-column prop="identityCard" label="身份证" width="200">
                </el-table-column>
                <el-table-column label="政治面貌">
                  <template #default="scope">{{
                    scope.row.isPartyMember === "00" ? "群众" : "党员"
                  }}</template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" width="120"> </el-table-column>
                <el-table-column prop="address" label="家庭住址">
                </el-table-column>
                <el-table-column width="200" label="操作" align="center">
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
                      @click="handleDelete(scope.row, scope.$index)"
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
            <el-dialog title="编辑" v-model="editVisible" width="38%">
              <el-form label-width="110px" :model="form" ref="formRef" :rules="rules">
                <el-form-item label="姓名" prop="showName">
                  <el-input v-model="form.showName"></el-input>
                </el-form-item>
                <el-form-item label="身份证" prop="identityCard" :required="true">
                  <el-input v-model="form.identityCard"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="政治面貌" prop="isPartyMember">
                  <el-radio-group v-model="form.isPartyMember">
                    <el-radio label="00">群众</el-radio>
                    <el-radio label="01">党员</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="家庭住址" prop="address">
                  <el-input v-model="form.address"></el-input>
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
import { ElMessage, ElMessageBox } from "element-plus";
import useImportExport from '@/hooks/useImportExport'
import { listAreaCodeTree, listCitizen, getCitizen, removeCitizen, editCitizen } from "../api/index";
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
      pageNum: 1,
      pageSize: 10,
      countryId: '',
      townId: '',
      showName: '',
      isPartyMember: ''
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    const getCitizenList = async () => {
      try {
        const { data } = await listCitizen(query);
        tableData.value = data.list;
        pageTotal.value = data.total;
      } catch (error) {
        console.log("error: ", error);
      }
    }
    const handleNodeClick = async (item, node) => {
      if (node.level === 1) return
      const { id, parentId } = item;
      query.countryId = id,
      query.townId = parentId
      getCitizenList()
    };
    const searchFormRef = ref(null)
    const submitForm = () => {
      searchFormRef.value.validate((valid) => {
        if (valid) {
          getCitizenList()
        }
      });
    };
    const resetForm = (formName) => {
      searchFormRef.value.resetFields()
    };
    // 分页导航
    const handlePageChange = (val) => {
        query.pageNum = val;
        getCitizenList();
    };

    // 删除操作
    const handleDelete = (item) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          const { id, countryId, townId } = item
          await removeCitizen({ id, countryId, townId })
          ElMessage.success("删除成功");
          getCitizenList()
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    const formRef = ref(null);
    let form = reactive({
      showName: "",
      countryId: "",
      townId: "",
      identityCard: "",
      isPartyMember: "00",
      phone: "",
      id: "",
      address: "",
      location: '',
      longitude: '',
      latitude: ''
    });
    const handleEdit = async (row) => {
      if (!query.countryId) return ElMessage.error("请选择村庄");
      if (row) {
        const { id, countryId, townId } = row
        const opts = {
          id,
          countryId,
          townId
        }
        const {data} = await getCitizen(opts)
        Object.keys(form).forEach((item) => {
          form[item] = data[item];
        });
      } else {
        Object.keys(form).forEach((item) => {
          form[item] = '';
        })
        form.isPartyMember = '00'
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
            countryId: query.countryId,
            townId: query.townId
          }
          await editCitizen(opts)
          editVisible.value = false;
          getCitizenList()
        }
      })
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
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号'))
      }
      if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(value)) {
        return callback(new Error('请输入正确的手机号'))
      }
      callback()
    }
    const checkIdCard = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入身份证号'))
      }
      if (!/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(value)) {
        return callback(new Error('请输入正确的身份号'))
      }
      callback()
    }
    const rules = {
      showName: [
        { required: true, message: "请输入姓名", trigger: "blur" },
      ],
      identityCard: [
        { validator: checkIdCard, trigger: "blur" },
      ]
    };
    const { handleDownLoad } = useDownloadTemplate()
    const { handleExport, handleImport } = useImportExport()
    const handleFileSuccess = async (item) => {
      if (!query.countryId) return ElMessage.error("请选择村庄");
      handleImport(item, 'citize')
    }
    const handleToExport = async (type) => {
      if (!query.countryId) return ElMessage.error("请选择村庄");
      handleExport(type, query)
    }
    return {
      handleFileSuccess,
      handleToExport,
      handleDownLoad,
      tableData,
      query,
      submitForm,
      resetForm,
      handleEdit,
      saveEdit,
      editVisible,
      loadNode,
      form,
      pageTotal,
      handleNodeClick,
      handleDelete,
      handlePageChange,
      formRef,
      searchFormRef,
      rules
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
