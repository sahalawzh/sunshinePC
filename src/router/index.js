import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/townList",
        name: "townList",
        meta: {
          title: "乡镇详情",
        },
        component: () =>
          import(/* webpackChunkName: "townList" */ "../views/TownList.vue"),
      },
      {
        path: "/villageDetail",
        name: "villageDetail",
        meta: {
          title: "村庄详情",
        },
        component: () =>
          import(/* webpackChunkName: "townDetail" */ "../views/TownDetail.vue"),
      },
      {
        path: "/dwellerDetail",
        name: "dwellerDetail",
        meta: {
          title: "居民详情",
        },
        component: () =>
          import(/* webpackChunkName: "dwellerDetail" */ "../views/DwellerDetail.vue"),
      },
      {
        path: "/villageManage",
        name: "villageManage",
        meta: {
          title: "村情概况管理",
        },
        component: () =>
          import(/* webpackChunkName: "countryListInfo" */ "../views/CountryListInfo.vue"),
      },
      {
        path: "/villageCarousel",
        name: "villageCarousel",
        meta: {
          title: "村庄轮播管理",
        },
        component: () =>
          import(/* webpackChunkName: "villageCarousel" */ "../views/VillageCarousel.vue"),
      },
      {
        path: "/partyManage",
        name: "partyManage",
        meta: {
          title: "党务公开管理",
        },
        component: () =>
          import(/* webpackChunkName: "partyList" */ "../views/PartyList.vue"),
      },
      {
        path: "/villageOpen",
        name: "villageOpen",
        meta: {
          title: "村务公开管理",
        },
        component: () =>
          import(/* webpackChunkName: "countryList" */ "../views/CountryList.vue"),
      },
      {
        path: "/financeOpen",
        name: "financeOpen",
        meta: {
          title: "财务公开管理",
          // permission: true
        },
        component: () =>
          import(
            /* webpackChunkName: "financeList" */ "../views/FinanceList.vue"
          ),
      },
      {
        path: "/accountManage",
        name: "accountManage",
        meta: {
          title: "账号管理",
        },
        component: () =>
          import(/* webpackChunkName: "systemUser" */ "../views/SystemUser.vue"),
      }
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  const role = localStorage.getItem("ms_username");
  if (!role && to.path !== "/login") {
    next("/login");
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === "admin" ? next() : next("/403");
  } else {
    next();
  }
});

export default router;
