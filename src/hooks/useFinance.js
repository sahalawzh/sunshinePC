import { ref, reactive, computed } from "vue";
import WangEditor from "wangeditor";
import { UPLOAD_URL, getAffairList, removeAffairInfo, exportAffairInfo, listAreaCodeTree, editAffairInfo, importAffairInfoParty, importAffairInfoCountry, importAffairInfoFinance } from "../api/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { getFormatTime } from '@/utils/time'
import { useStore } from "vuex";
import useDownloadTemplate from '@/hooks/useDownloadTemplate'
import useImportExport from '@/hooks/useImportExport'
export default function useFinance (affairType) {
  let query = reactive({
    affairType,
    pageNum: 1,
    pageSize: 10,
  });
  const areaOpts = {
    areaLevel: 5,
  };
  const tableData = ref([]);
  const pageTotal = ref(0);
  const townList = ref([]);
  let instance;
  // 获取表格数据
  const getData = async () => {
    const [affairData, areaData] = await Promise.all([getAffairList(query), listAreaCodeTree(areaOpts)])
    const { list, total} = affairData.data
    tableData.value = list
    pageTotal.value = total
    townList.value = areaData.data
  };
  getData();

  // 搜索
  const searchFormRef = ref(null)
  const searchForm = reactive({
    countryName: '',
    townName: ''
  });
  const submitForm = () => {
    searchFormRef.value.validate((valid) => {
      if (valid) {
        query.pageNum = 1
        query = {
          ...query,
          ...searchForm
        }
        getData()
      }
    });
  }
  const resetForm = () => {
    searchFormRef.value.resetFields()
  }
  // 分页导航
  const handlePageChange = (val) => {
      query.pageNum = val;
      getData();
  };

  // 删除操作
  const handleDelete = (item) => {
    // 二次确认删除
    ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
    })
      .then(() => {
        const { countryId, townId, id } = item
        const opts = {
          countryId,
          townId,
          id
        }
        removeAffairInfo(opts).then((res) => {
          ElMessage.success("删除成功");
          getData()
        });
      })
      .catch(() => {});
  };

  // 表格编辑时弹窗和保存
  const editVisible = ref(false);
  const countryList = ref([]);
  let form = reactive({
    affairType: '',
    countryName: '',
    countryId: '',
    description: '',
    affairTitle: '',
    townId: '',
    townName: '',
    affairTime: '',
    id: '',
    briefPic: ''
  });
  const formRef = ref(null);
  const opStatus = ref('');
  const handleEdit = async (status, row) => {
    opStatus.value = status
    if (row) {
      const countryOpts = {
        areaLevel: 6,
        parentId: row.townId
      }
      const { data } = await listAreaCodeTree(countryOpts)
      countryList.value = data
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
  }
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
          form.affairType = affairType
          await editAffairInfo(form)
          editVisible.value = false
          getData()
        } catch (error) {
          console.log('error: ', error);
        }
      }
    })
  };

  // 时间转换
  const processTime = (time) => {
    return getFormatTime(time)
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

  // 富文本
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
      customInsert: function(insertImg, result, editor) {
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
  // 上传图片
  const handleRemove = () => {
    form.briefPic = ''
  }
  const handlePicSuccess = (response, file) => {
    form.briefPic = response.msg
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
  // store获取权限列表
  const store = useStore()
  const picLinkPrefix = computed(() => store.state.picLinkPrefix)
  
  // 导出
  const handleToExport = async () => {
    try {
      const opts = {
        ...form,
        affairType
      }
      const res = await exportAffairInfo(opts, { responseType: 'blob' })
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
    } catch (error) {
      console.log('error: ', error);
    }
  }
  
  const { handleImport } = useImportExport()
  const handleFileSuccess = async (item) => {
    handleImport(item, 'finance')
  }

  const rules = {
    townId: [
      { required: true, message: "请选择乡镇", trigger: "change" },
    ],
    countryId: [
      { required: true, message: "请选择所属村庄", trigger: "change" },
    ],
    affairTitle: [
      { required: true, message: "请输入公开标题", trigger: "blur" },
    ],
    description: [
      { required: true, message: "请输入公开内容", trigger: "blur" },
    ],
    affairTime: [
      { required: true, message: "请输入添加时间", trigger: "blur" },
    ]
  };
  const { handleDownLoad } = useDownloadTemplate()

  return {
    handleDownLoad,
    tableData,
    query,
    submitForm,
    resetForm,
    handleEdit,
    handleSaveEvent,
    editVisible,
    handlePageChange,
    handleDelete,
    pageTotal,
    processTime,
    opStatus,
    townList,
    countryList,
    handleChangeTown,
    form,
    searchForm,
    editor,
    content,
    showDialog,
    hideDialog,
    formRef,
    searchFormRef,
    csrfToken,
    handlePicSuccess,
    picLinkPrefix,
    handleRemove,
    handleToExport,
    handleFileSuccess,
    rules,
    UPLOAD_URL
  };
}