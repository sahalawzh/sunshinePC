<!--
 * @Description: 
 * @Version: Do not edit
 * @Autor: wuzhihong
 * @Date: 2022-06-07 14:40:36
 * @LastEditors: wuzhihong
 * @LastEditTime: 2022-07-03 23:38:24
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
              v-model="searchForm.townName"></el-input>
          </el-form-item>
          <el-form-item label="村庄名称:" prop="countryName">
            <el-input
              size="small"
              placeholder="请输入村庄名称"
              v-model="searchForm.countryName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" size="small" type="primary" @click="submitForm">筛选</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <div class="common-section container">
      <el-row class="mb20">
        <el-button icon="el-icon-circle-plus-outline" size="small" type="primary" @click="handleEdit('add')">添加</el-button>
        <el-upload
          :on-change="handleFileSuccess"
          ref="upload"
          accept=".xlsx, .xls"
          :show-file-list="false"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">导入</el-button>
        </el-upload>
        <el-button size="small" type="primary" @click="handleToExport">导出</el-button>
        <el-button size="small" type="primary" @click="handleDownLoad('finance')">下载模板</el-button>
      </el-row>
      <div class="common-list">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="countryName"
            label="村庄名称">
          </el-table-column>
          <el-table-column
            prop="townName"
            label="所属乡镇">
          </el-table-column>
          <el-table-column
            prop="affairTitle"
            label="财务公开标题"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="editPersonName"
            label="添加人">
          </el-table-column>
          <el-table-column
            label="添加时间">
            <template #default="scope">
              {{processTime(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column width="260" label="操作" align="center">
            <template #default="scope">
              <el-button size="mini" type="primary" plain @click="handleEdit('detail', scope.row)">详情
              </el-button>
              <el-button size="mini" type="info" plain @click="handleEdit('eidt', scope.row)">编辑
              </el-button>
              <el-button @click="handleDelete(scope.row)"  size="mini" plain type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageNum"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog 
      @opened="showDialog"
      @closed="hideDialog"
      :title="opStatus === 'edit' ? '编辑' : opStatus === 'detail' ? '查看详情' : '新增'" 
      v-model="editVisible" 
      width="38%">
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
            placeholder="请选择所属村庄"
            :disabled="opStatus === 'detail'">
            <el-option
              v-for="item in countryList"
              :key="item.areaId"
              :label="item.areaName"
              :value="item.areaId"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="公开标题" prop="affairTitle">
          <el-input v-model="form.affairTitle" :disabled="opStatus === 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="公开内容" :required="true">
          <div class="mgb20" ref="editor"></div>
        </el-form-item>
        <el-form-item label="所属时间" prop="affairTime">
          <el-date-picker
            v-model="form.affairTime"
            :disabled="opStatus === 'detail'"
            type="date"
            placeholder="请选择添加时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="封面图" prop="briefPic">
          <el-upload
            list-type="picture-card"
            :on-success="handlePicSuccess"
            :headers="csrfToken"
            :limit="1"
            :class="{ hide: form.briefPic }"
            :on-remove="handleRemove"
            :file-list="form.briefPic ? [{name: 'upload', url: picLinkPrefix + form.briefPic}] : []"
            :action="UPLOAD_URL">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="el-upload__tip">图片仅用做列表展示，内容图片需要在公开内容里面上传</div>
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
</template>
<script>
import useFinance from '@/hooks/useFinance'
export default {
  name: "FinanceList",
  setup() {
    const financeMap = useFinance('finance')
    
    return {
      ...financeMap
    }
  }
};
</script>
<style lang="scss" >
.el-upload--text {
  width: auto;
  height: auto;
  border-radius: 0;
  margin: 0 10px;
  overflow: inherit;
  border: none;
}
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
  .hide .el-upload--picture-card {
    display: none;
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
</style>
