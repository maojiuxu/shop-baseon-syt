import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Dropdown, Button } from "antd";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logoutAsync, selectUser } from "@pages/login/slice";

import "./index.less";

function AvatarComponent() {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigator("/login");
  };

  const { t } = useTranslation("app");

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to="/syt/dashboard">{t("goHomeBtnText")}</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <div onClick={handleLogout}>{t("logoutBtnText")}</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button className="layout-dropdown-link" type="link">
        <img className="layout-avatar" src={user.avatar} alt="avatar" />
      </Button>
    </Dropdown>
  );
}

export default AvatarComponent;
