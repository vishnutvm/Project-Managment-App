import React from "react";
import { Layout, Flex } from "antd";
import { Avatar, Badge } from "antd";
import bell from "../../assets/bell.svg";
import memo from "../../assets/memo.png";
import Icon, { BellOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { logoutUser } from "../../Redux/UserReducer";
const { Header } = Layout;

function Headers() {
  const userDetails = useSelector((state) => state.user.loginUserDetails);
  
  let  name=userDetails?.name


  const headerStyle = {
    textAlign: "center",
    height: 64,
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#FFFFF",
    display: "flex",
    border: "",
  };
  return (
    <Header style={headerStyle}>
      {/* <h1 className="">Dashboard</h1> */}
      <Flex className="w-full" justify="flex-end" gap={12}>
        <Badge>
          <Avatar className="mt-2" size={42}>
            <BellOutlined className="text-3xl " />
          </Avatar>
        </Badge>
        <Avatar src={memo} size={52} />
        <Flex vertical gap={3} justify="center">
          <p className="leading-none">{name}</p>
          <p className="leading-none">Admin</p>
        </Flex>
      </Flex>
    </Header>
  );
}

export default Headers;
