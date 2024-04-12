import React from "react";
import Headers from "../Components/Header/Headers";
import Sidebar from "../Components/SIdebar/Sidebar";
import { Layout } from "antd";
import "../Layouts/Layout.css";
function Layouts(props) {
  const { Content } = Layout;
  return (
    <div>
      <div>
        <Layout hasSider className="h-screen">
          <Sidebar />
          <Layout>
            <Headers />
            <Content
              className="bg-#F0F3F8  scrollable-content
"
            >
              {" "}
              {props.children}
            </Content>
          </Layout>
        </Layout>
      </div>
    </div>
  );
}

export default Layouts;
