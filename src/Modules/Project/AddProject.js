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
  Switch,
  Alert,
} from 'antd';
import axios from 'axios';
import config from '../../Config/Config';
import { useSelector } from 'react-redux';
import ProjectTree from '../../Components/Tree/Tree';
import DetailModal from '../../Components/NodeDetails/NodeDetails';

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
  const [allProject, setAllProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMileStone, setselectedMileStone] = useState(null);
  const [isTask, setIsTask] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(null);
  const extractAllProjectData = (data) => {
    const allProjectsDetails = [];

    const handleTask = (tasks) => {
      const allTasks = [];
      tasks.forEach((task) => {
        allTasks.push({ name: task.name, _id: task._id });
        if (task.tasks) {
          // Recursively handle tasks at deeper levels
          allTasks.push(...handleTask(task.tasks));
        }
      });
      return allTasks;
    };

    const handleMilestone = (milestones) => {
      const allMilestones = [];
      milestones.forEach((milestone) => {
        const tasks = handleTask(milestone.tasks || []);
        allMilestones.push({
          name: milestone.name,
          _id: milestone._id,
          tasks: tasks,
        });
      });
      return allMilestones;
    };

    data.forEach((project) => {
      const milestones = handleMilestone(project.milestones || []);
      allProjectsDetails.push({
        _id: project._id,
        name: project.name,
        milestones: milestones,
      });
    });

    console.log(
      'extractAllProjectData ~ allProjectsDetails:',
      allProjectsDetails
    );
    return allProjectsDetails;
  };
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
          const allProjectsData = response?.data?.response || [];
          setTreeData(allProjectsData);

          // Setting all Project ids
          const allProjectsDetails = extractAllProjectData(allProjectsData);
          setAllProject(allProjectsDetails);
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
    } finally {
      form.resetFields();
      fetchProject();
    }
  };
  const onFinishCreateMilestone = async (values) => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/createMilestone`,
        { projectId: values.projectId, assignedBy, values: { ...values } },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.isSuccess) {
        setMilestone(response.data.response);
        message.success('milestone created');
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
    } finally {
      form.resetFields();
      setShowMilestoneModal(false);
      fetchProject();
    }
  };
  const onFinishTaskCreation = async (values) => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/createTask`,
        {
          values,
          assignedBy,
          parentTaskId: values.parentTaskId,
          projectId: values.projectId,
          milestoneId: values.milestoneId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.isSuccess) {
        message.success('Task created');
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      message.error('Something Went Wrong');
    } finally {
      form.resetFields();
      fetchProject();
      setShowTaskModal(false);
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

  const { Option } = Select;

  const onFinishFailed = () => {};
  const { RangePicker } = DatePicker;
  const handleCancel = () => {
    setShowProjectModal(false);
    setShowMilestoneModal(false);
    setShowTaskModal(false);
  };
  const handleProjectSelect = (value) => {
    setSelectedProject(value);
  };
  const handleMileStoneSelect = (value) => {
    setselectedMileStone(value);
  };

  const findNodeById = (data, id) => {
    for (const node of data) {
      if (node._id === id) {
        return node;
      }
      if (node.milestones) {
        const foundNode = findNodeById(node.milestones, id);
        if (foundNode) return foundNode;
      }
      if (node.tasks) {
        const foundNode = findNodeById(node.tasks, id);
        if (foundNode) return foundNode;
      }
    }
    return null;
  };
  const handleTreeNodeSelection = (id) => {
    console.log('handleTreeNodeSelection ~ id:', id);
    const selectedNode = findNodeById(treeData, id);
    if (selectedNode) {
      console.log('Selected Node:', selectedNode);
      setShowDetailModal(selectedNode);
    } else {
      console.log('Node not found with ID:', id);
    }
  };

  const onDetailsModalCancel = () => {
    setShowDetailModal(null);
  };

  return (
    <>
      {' '}
      <div
        style={{
          margin: 'auto',
          padding: '20px',
          width: '100%',
          marginBottom: '1rem',
        }}
      >
        <div style={{ margin: 'auto', maxWidth: '1200px' }}>
          <Flex justify="center" gap={24} style={{ marginBottom: '40px' }}>
            <Button type="primary" onClick={handleCreateProject}>
              Create Project
            </Button>
            <Button type="primary" onClick={handleCreateMilestone}>
              Create Milestone
            </Button>
            <Button type="primary" onClick={handleCreateTask}>
              Create Task
            </Button>
          </Flex>

          {/* Tree Structure Cards */}
          <Flex justify="center" align="flex-start" wrap="wrap" gap={24}>
            {treeData.map((project) => (
              <Card className="w-[90%]" key={project.key}>
                <ProjectTree
                  data={[project]}
                  onNodeSelect={handleTreeNodeSelection}
                />
              </Card>
            ))}
          </Flex>
        </div>
      </div>
      {/* Buttons For Creating Project, MileStone, Task */}
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
            form={form}
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
            onFinish={onFinishCreateProject}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Project Name"
              name="name"
              rules={[{ required: true, message: 'Please Enter a Name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: 'Please Enter a description!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Timeframe"
              name="timeframe"
              rules={[
                { required: true, message: 'Please Select a Time Frame!' },
              ]}
            >
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
            form={form}
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
            <Form.Item
              label="Select Project"
              name="projectId"
              rules={[{ required: true, message: 'Please Select a Project!' }]}
            >
              <Select>
                {allProject.map((project) => (
                  <Option value={project._id}>{project.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please Enter a Name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: 'Please Enter a description!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Assign to"
              name="assignee"
              rules={[{ required: true, message: 'Please Assign to Someone!' }]}
            >
              <Select>
                {memberList.map((friend) => (
                  <Option value={friend._id}>{friend.email}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Timeframe"
              name="timeframe"
              rules={[
                { required: true, message: 'Please Select a Time Frame!' },
              ]}
            >
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
                  Save MileStone
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
            form={form}
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
            <Form.Item label="Task Type" name="isTask">
              <Switch
                checkedChildren="Task"
                unCheckedChildren="Subtask"
                checked={isTask}
                onChange={(checked) => setIsTask(checked)}
              />
            </Form.Item>

            <Form.Item label="Select Project" name="projectId">
              <Select
                onChange={handleProjectSelect}
                rules={[
                  { required: true, message: 'Please select a Project!' },
                ]}
              >
                {allProject.map((project) => (
                  <Option key={project._id} value={project._id}>
                    {project.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Select Milestone"
              name="milestoneId"
              rules={[
                { required: true, message: 'Please select a Milestone!' },
              ]}
            >
              <Select onChange={handleMileStoneSelect}>
                {selectedProject &&
                  allProject
                    .find((project) => project._id === selectedProject)
                    .milestones.map((milestone) => (
                      <Option key={milestone._id} value={milestone._id}>
                        {milestone.name}
                      </Option>
                    ))}
              </Select>
            </Form.Item>

            {!isTask && selectedProject && selectedMileStone && (
              <Form.Item
                label="Select Task"
                name="parentTaskId"
                rules={[{ required: true, message: 'Please select a task!' }]}
              >
                <Select>
                  {allProject
                    ?.find((project) => project._id === selectedProject)
                    ?.milestones.find(
                      (milestone) => milestone._id === selectedMileStone
                    )
                    ?.tasks?.map((task) => (
                      <Option key={task._id} value={task._id}>
                        {task.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please Enter a Name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: 'Please Enter a description!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Assign to"
              name="assignee"
              rules={[{ required: true, message: 'Please Assign to Someone!' }]}
            >
              <Select>
                {memberList.map((friend) => (
                  <Option value={friend._id}>{friend.email}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Timeframe"
              name="timeframe"
              rules={[
                { required: true, message: 'Please Select a Time Frame!' },
              ]}
            >
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
                  Save Task
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <DetailModal
        visible={showDetailModal}
        data={showDetailModal}
        onCancel={onDetailsModalCancel}
      />
    </>
  );
};
export default AddProject;
