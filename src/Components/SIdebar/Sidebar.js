import React from 'react';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import '../SIdebar/Sidebar.css';
import norq from '../../assets/norq.jpeg';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../Redux/UserReducer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const { Sider } = Layout;

const Sidebar = () => {
  const dispatch = useDispatch();
  const items = [
    { key: '1', icon: <UserOutlined />, label: 'Project', link: '/' },
    { key: '2', icon: <VideoCameraOutlined />, label: 'Tasks', link: '/tasks' },
    { key: '3', icon: <UserOutlined />, label: 'Members', link: '/members' },
    {
      key: '4',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        dispatch(logoutUser());
        navigate('/login');
      },
    },
  ];

  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      <div className="logo">
        <img className="logo" src={norq} alt="Logo" />
      </div>
      <Menu mode="inline" defaultSelectedKeys={['1']}>
        {items.map((item) => (
          <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
            <Link to={item.link}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};
export default Sidebar;
