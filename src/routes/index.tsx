// src/routes/index.tsx
import React, { lazy, Suspense, FC } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { HomeOutlined,PlusSquareOutlined,SettingOutlined ,UnorderedListOutlined} from "@ant-design/icons";
import type { SRoutes } from "./types";

import {
  Layout,
  EmptyLayout,
  // CompLayout
} from "../layouts";
import Loading from "@comps/Loading";

import Translation from "@comps/Translation";

const Login = lazy(() => import("@pages/login"));
const Dashboard = lazy(() => import("@pages/dashboard"));
const NotFound = lazy(() => import("@pages/404"));
//导入医院设置和医院列表组件  懒加载
const HospitalSet = lazy(()=>import("@pages/hospital/hospitalSet"))
const HospitalList = lazy(()=>import("@pages/hospital/hospitalList"))
const AddOrUpdateHospital = lazy(()=>import("@pages/hospital/hospitalSet/components/AddOrUpdateHospital"))

const HospitalShow = lazy(()=>import("@pages/hospital/hospitalList/components/HospitalShow"))
const HospitalSchedule = lazy(()=>import("@pages/hospital/hospitalList/components/HospitalSchedule"))

const load = (Comp: FC) => {
  return (
    // 因为路由懒加载，组件需要一段网络请求时间才能加载并渲染
    // 在组件还未渲染时，fallback就生效，来渲染一个加载进度条效果
    // 当组件渲染完成时，fallback就失效了
    <Suspense fallback={<Loading />}>
      {/* 所有lazy的组件必须包裹Suspense组件，才能实现功能 */}
      <Comp />
    </Suspense>
  );
};

const routes: SRoutes = [
  {
    path: "/",
    element: <EmptyLayout />,
    children: [
      {
        path: "login",
        element: load(Login),
      },
    ],
  },
  {
    path: "/syt",
    element: <Layout />,
    children: [
      {
        path: "/syt/dashboard",
        meta: { icon: <HomeOutlined />, title: <Translation>route:dashboard</Translation> },
        element: load(Dashboard),
      },
      //配置医院管理路由
      {
        path: "/syt/hospital",
        meta: { icon: <PlusSquareOutlined />, title: "医院管理" },
        children:[
          //医院设置路由配置
          {
            path: "/syt/hospital/hospitalSet",
            meta: { icon: <SettingOutlined />, title: "医院设置" },
            element: load(HospitalSet),
          },
          //医院列表路由配置
          {
            path: "/syt/hospital/hospitalList",
            meta: { icon: <UnorderedListOutlined />, title: "医院列表" },
            element: load(HospitalList),
          },
          //添加医院路由配置
          {
            path: "/syt/hospital/hospitalSet/add",
            meta: { icon: <UnorderedListOutlined />, title: "添加医院" },
            element: load(AddOrUpdateHospital),
            hidden:true  //导航栏隐藏导航
          },
           //修改医院路由配置
           {
            path: "/syt/hospital/hospitalSet/edit/:id",
            meta: { icon: <UnorderedListOutlined />, title: "修改医院" },
            element: load(AddOrUpdateHospital),
            hidden:true  //导航栏隐藏导航
          },
          //查看医院路由配置
          {
            path: "/syt/hospital/hospitalList/show/:id",
            meta: { icon: <UnorderedListOutlined />, title: "查看医院" },
            element: load(HospitalShow),
            hidden:true  //导航栏隐藏导航
          },
          //医院排班路由配置
          {
            path: "/syt/hospital/hospitalList/schedule/:hoscode",
            meta: { icon: <UnorderedListOutlined />, title: "医院排班" },
            element: load(HospitalSchedule),
            hidden:true  //导航栏隐藏导航
          }

        ]
      },
      
    ],
  },

  {
    path: "/404",
    element: load(NotFound),
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
];

/* 
自定义hook: 注册应用的所有路由
*/
export const useAppRoutes = () => {
  return useRoutes(routes);
};

// 找到要渲染成左侧菜单的路由
export const findSideBarRoutes = () => {
  const currentIndex = routes.findIndex((route) => route.path === "/syt");
  return routes[currentIndex].children as SRoutes;
};

export default routes;
