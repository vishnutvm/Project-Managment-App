import React, { useState, useEffect } from 'react';
import {
  Tree,
  Modal,
  Button,
  form,
  Form,
  Input,
  Card,
  Flex,
  DatePicker,
  message,
  Select,
} from 'antd';
import axios from 'axios';
import config from '../../Config/Config';
import { useSelector } from 'react-redux';
import ProjectTree from '../../Components/Tree/Tree';
import { ProjectData } from './dummyData';
const updateTreeData = (list, key, children) =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
const AddProject = () => {
  const [treeData, setTreeData] = useState([]);
  const [form] = Form.useForm();
  const userDetails = useSelector((state) => state.user.loginUserDetails);
  const projectId = '';
  const token = userDetails.tokens[userDetails.tokens.length - 1];
  const memberList = userDetails.members;
  const assignedBy = userDetails._id;
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [Project, setProject] = useState({});
  const [milestone, setMilestone] = useState({});
  const [task, setTask] = useState({});
  const fetchProject = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/getProjectList`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.isSuccess) {
        if (
          Array.isArray(response?.data?.response) &&
          response?.data?.response.length > 0
        ) {
          setTreeData(response?.data?.response || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const handleCreateProject = () => {
    setShowProjectModal(true);
  };
  const onFinishCreateMilestone = async (values) => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/createMilestone`,
        { values, projectId, assignedBy },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log('res', response);
      if (response.data.isSuccess) {
        setMilestone(response.data.response);
        setShowMilestoneModal(false);
        message.success('milestone created');

        form.resetFields('');
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.log('error');
    }
  };
  const onFinishTaskCreation = async (values) => {
    console.log('values', values);
    try {
      const response = await axios.post(
        `${config.apiUrl}/createTask`,
        { projectId, values, assignedBy },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log('res', response);
      if (response.data.isSuccess) {
        setTask(response.data.response);
        setShowTaskModal(false);
        message.success('task added');
        form.resetFields('');
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.log('error');
    }
  };
  const handleCreateTask = () => {
    setShowTaskModal(true);
  };

  const handleCreateMilestone = () => {
    setShowMilestoneModal(true);
  };
  const handleProjectModalOk = () => {
    setShowProjectModal(false);
  };

  const handleMilestoneModalOk = () => {
    setShowMilestoneModal(false);
  };

  const handleTaskModalOk = () => {
    setShowTaskModal(false);
  };
  const onFinishCreateProject = async (values) => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/createProject`,
        values,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.isSuccess) {
        message.success('project created');
        setProject(response.data.response);
        setShowProjectModal(false);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      message.success('Something went wrong');
      console.log('error');
    }finally{
      fetchProject();
    }
  };
  const { Option } = Select;

  const onFinishFailed = () => {};
  const { RangePicker } = DatePicker;
  const handleCancel = () => {
    setShowProjectModal(false);
    setShowMilestoneModal(false);
    setShowTaskModal(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px' }}>
      {/* Buttons For Creating Project, MileStone, Task */}
      <Flex justify="center" gap={6} style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={handleCreateProject}>
          Create Project
        </Button>
        <Button type="primary" onClick={handleCreateMilestone}>
          Add Milestone
        </Button>
        <Button type="primary" onClick={handleCreateTask}>
          Create Subtask
        </Button>
      </Flex>

      <Flex gap={20}>
        {/* Tree Structure Card */}
        <Card
          style={{
            flex: '1 1 400px',
            maxHeight: '600px',
            overflow: 'auto',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          }}
        >
          <h1 className=" text-center mb-9 font-semibold text-3xl">
            {' '}
            All Projects
          </h1>
          <ProjectTree data={treeData} />
        </Card>
      </Flex>

      {/* Modals */}

      {/* Create Project */}
      <Modal
        title="Create Project"
        open={showProjectModal}
        onOk={handleProjectModalOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Card>
          <Form
            className="mt-8 w-full"
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 24,
            }}
            style={{
              maxWidth: 700,
            }}
            initialValues={{
              remember: true,
            }}
            form={form}
            onFinish={onFinishCreateProject}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label="Project Name" name="name">
              <Input />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>

            <Form.Item label="Timeframe" name="timeframe">
              <RangePicker />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Flex justify="space-between">
                <Button htmlType="submit" type="primary">
                  Save Project
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      {/* Create  Milestone */}
      <Modal
        title="Create Milestone"
        open={showMilestoneModal}
        onOk={handleMilestoneModalOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Card>
          <Form
            className="mt-8  w-full"
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 24,
            }}
            style={{
              maxWidth: 700,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinishCreateMilestone}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>
            <Form.Item label="Assign to" name="assignee">
              <Select>
                {memberList.map((friend) => (
                  <Option value={friend._id}>{friend.email}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Timeframe" name="timeframe">
              <RangePicker />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Flex justify="space-between">
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      {/* Create  Task */}
      <Modal
        title="Create Subtask"
        open={showTaskModal}
        onOk={handleTaskModalOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Card>
          <Form
            className="mt-8  w-full"
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 24,
            }}
            style={{
              maxWidth: 700,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinishTaskCreation}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>
            <Form.Item label="Assign to" name="assignee">
              <Select>
                {memberList.map((friend) => (
                  <Option value={friend._id}>{friend.email}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Timeframe" name="timeframe">
              <RangePicker />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Flex justify="space-between">
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};
export default AddProject;
