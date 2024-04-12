
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Radio,Card,message } from "antd";
import "../Login/Login.css";
import axios from "axios";
import config from "../../Config/Config";
import { getUserLoginDetails } from "../../Redux/UserReducer";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom"
 

function Login() {
    const [value, setValue] = useState({
        email: "",
        password: "",
        userType: "manager", // Default user type
      });
      const [form] = Form.useForm();
      const [formLayout, setFormLayout] = useState("vertical");
      const dispatch=useDispatch()
      const navigate = useNavigate()
      const formItemLayout =
      formLayout === "horizontal"
        ? {
            labelCol: {
              span: 4,
            },
            wrapperCol: {
              span: 14,
            },
          }
        : null;
        const onFormLayoutChange = ({ layout }) => {
            setFormLayout(layout);
          };
        
    const buttonItemLayout =
      formLayout === "vertical"
        ? {
            wrapperCol: {
              span: 14,
              offset: 4,
            },
          }
        : null;
        const handleLogin=async()=>{
          try {
            const { email, password } = value;
            const response = await axios.post(`${config.apiUrl}/userLogin`, {
              email,
              password,
              
            });
            console.log("login response", response);
            if (response.data.isSuccess) {
              const user = response.data.response;
              console.log("user",user);
              dispatch(getUserLoginDetails(user));
              navigate("/dashboard")
            
            } else {
              message.error(response.data?.error);
            }
          } catch (error) {
            console.log("error");
          }
        };

        
  return (
    <div className="login_container">
    <div className="login_topbar">
      <div className="empire">Norque</div>{" "}
    </div>
    <Card className="log_card items-center justify-center bg-white">
      <h1 className="mb-10 font-bold loginpage">LOGIN</h1>
      <div className="forms">
        <Form
          {...formItemLayout}
          layout={formLayout}
          form={form}
          initialValues={{
            layout: formLayout,
          }}
          onValuesChange={onFormLayoutChange}
          style={{
            maxWidth: formLayout === "inline" ? "none" : 600,
          }}
        >
          <div className="formm">
            {/* <Form.Item className="welcome" label="Welcome Back" name="layout">
            <Radio.Group value={formLayout}></Radio.Group>
          </Form.Item> */}

            <Form.Item label="enter your email">
              <Input
                className="input_container"
                name="email"
                type="email"
                value={value.email}
                rules={[
                  {
                    type: "email",
                    required: true,
                  },
                ]}
                onChange={(e) =>
                  setValue({ ...value, [e.target.name]: e.target.value })
                }
                placeholder="enter email"
              />
            </Form.Item>
            <Form.Item label="password">
              <Input
                className="input_container"
                type="password"
                name="password"
                value={value.password}
                rules={[
                  {
                    required: true,
                  },
                ]}
                onChange={(e) =>
                  setValue({ ...value, [e.target.name]: e.target.value })
                }
                placeholder="enter password"
              />
            </Form.Item>
         
            <Form.Item {...buttonItemLayout}>
              <Button className="submit_button"  onClick={() => handleLogin()}>
                <div className="submit_text">submit</div>
              </Button>
            </Form.Item>
            <div>
            
            </div>
          </div>
        </Form>
      </div>
    </Card>
  </div>
  )
}

export default Login
