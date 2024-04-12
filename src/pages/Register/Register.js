import React, { useEffect, useState } from "react";
import { Button, Form, Input, Row, Col, message } from "antd";
import "../Register/Register.css";
import axios from "axios";
import config from "../../Config/Config";
import {useNavigate} from "react-router-dom"

function Register() {
  const [value, setValue] = useState({
    name: "",
    email: "",
    password: "",
    
    confirmPassword: "",
    phoneNumber: "",
  });
  const navigate=useNavigate()
  const [form] = Form.useForm();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [formLayout, setFormLayout] = useState("vertical");
  const handleRegister = async (values) => {
    try {
      const { name, email, password, confirmPassword, phoneNumber, gender } = value;
      const response = await axios.post(`${config.apiUrl}/userRegister`, {
        email,
        password,
        confirmPassword,
        phoneNumber,
        name,
      });
      console.log("register response", response);
      if (response.data.isSuccess) {
        message.success("succeffully registered")
        navigate("/login")
      } else {
        message.error(response.data?.error);
      }
    } catch (error) {
      console.log("error");
    }
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
  return (
    <div className="login_container">
      <div className="login_topbar">
        <div className="empire">Norq</div>
      </div>
      <div className="log_card items-center justify-center h-[420px]   bg-white">
        <div>
          <Form
            className="forms"
            form={form}
            onFinish={handleRegister}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            layout="horizontal"
          >
            {/* <Row gutter={[6, 6]} >  */}

            <Form.Item label="enter your name">
              <Input
                className="input_container"
                name="name"
                type="text"
                value={value.name}
                onChange={handleChange}
                placeholder="Enter Name"
              />
            </Form.Item>
            <Form.Item label="enter your email">
              <Input
                className="input_container"
                name="email"
                type="email"
                value={value.email}
                onChange={handleChange}
                placeholder="Enter Email"
              />
            </Form.Item>
            <Form.Item label="password">
              <Input
                className="input_container"
                name="password"
                type="password"
                value={value.password}
                onChange={handleChange}
                placeholder="Enter Password"
              />
            </Form.Item>

            <Form.Item label="Confirm Password">
              <Input
                className="input_container"
                name="confirmPassword"
                type="password"
                value={value.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item label="Mobile Number">
              <Input
                className="input_container"
                name="phoneNumber"
                type="text"
                value={value.phoneNumber}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
              />
            </Form.Item>

            <Form.Item {...buttonItemLayout}>
              <button className="submit_buttonreg">
                <div className="submit_text">submit</div>
              </button>
            </Form.Item>
            {/* </Row> */}
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
