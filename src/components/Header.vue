<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">东平县阳光三务</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 消息中心 -->
        <!-- <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div> -->
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
              <el-dropdown-item divided @click="drawer = true"
                >修改密码</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-drawer
      title="修改密码"
      v-model="drawer"
      direction="rtl"
    >
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="drawer-form">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
import { computed, onMounted, ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
var validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    if (this.ruleForm.checkPass !== '') {
      this.$refs.ruleForm.validateField('checkPass');
    }
    callback();
  }
};
var validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== this.ruleForm.pass) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};
export default {
  setup() {
    const username = localStorage.getItem("ms_username");
    const message = 2;

    const store = useStore();
    const collapse = computed(() => store.state.collapse);
    // 侧边栏折叠
    const collapseChage = () => {
      store.commit("handleCollapse", !collapse.value);
    };
    let ruleForm = reactive({
      pass: '',
      checkPass: ''
    });
    onMounted(() => {
      if (document.body.clientWidth < 1500) {
        collapseChage();
      }
    });
    const rules = {
      pass: [
        { validator: validatePass, trigger: 'blur' }
      ],
      checkPass: [
        { validator: validatePass2, trigger: 'blur' }
      ]
    }
    // 用户名下拉菜单选择事件
    const router = useRouter();
    const handleCommand = (command) => {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        localStorage.removeItem("envJwtToken");
        router.push("/login");
      } else if (command == "user") {
        router.push("/user");
      }
    };
    const drawer = ref(false);
    return {
      username,
      message,
      collapse,
      collapseChage,
      handleCommand,
      drawer,
      ruleForm,
      rules
    };
  },
};
</script>
<style scoped>
.drawer-form {
  padding: 0 40px 0 20px;
}
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
