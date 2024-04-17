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
  Tabs,
} from 'antd';
import axios from 'axios';
import config from '../../Config/Config';
import { useSelector } from 'react-redux';
import ProjectTree from '../../Components/Tree/Tree';
import DetailModal from '../../Components/NodeDetails/NodeDetails';
import dayjs from 'dayjs';
import moment from 'moment';
const { TabPane } = Tabs;

const AddProject = () => {
  const [treeData, setTreeData] = useState([]);
  const [assignedToMeTreeData, setAssignedToMeTreeData] = useState([]);
  const [form] = Form.useForm();
  const [allMileStonesAssignedToMe, setAllMileStonesAssignedToMe] = useState(
    []
  );
  const [allTasksAssignedToMe, setAllTasksAssignedToMe] = useState([]);
  const [editForm] = Form.useForm();
  const [mode, setMode] = useState('createdByMe');
  const [selectedTimeframe, setSelectedTimeframe] = useState([
    moment('2024-04-05T18:30:00.000Z'),
    moment('2024-04-08T18:30:00.000Z'),
  ]);
  const [assingedTaskSubTaskCreatin, setAssingedTaskSubTaskCreatin] =
    useState(true);
  const userDetails = useSelector((state) => state.user.loginUserDetails);
  const projectId = '';
  const token = userDetails.tokens[userDetails.tokens.length - 1];
  const assignedBy = userDetails._id;
  const memberList = [
    ...userDetails.members,
    { email: 'Assign To Me', _id: assignedBy },
  ];
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskModal2, setShowTaskModal2] = useState(false);
  const [showSubTaskModal2, setShowSubTaskModal2] = useState(false);
  const [Project, setProject] = useState({});
  const [milestone, setMilestone] = useState({});
  const [allProject, setAllProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMileStone, setselectedMileStone] = useState(null);
  const [isTask, setIsTask] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(null);
  const [editModalType, setEditModalType] = useState('Unknown');
  const [editModalData, setEditModalData] = useState({});
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showEditMileStoneModal, setShowEditMileStoneModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const handleTabChange = (key) => {
    setMode(key);
  };

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
  const fetchProjectAssignedToMe = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/getAssignedItemsForUser`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.success) {
        if (
          Array.isArray(response?.data?.data?.data) &&
          response?.data?.data?.data.length > 0
        ) {
          const allProjectsData =
            response?.data?.data?.data.map((item) => ({
              ...item.item,
              itemType: item.itemType,
            })) || [];

          setAssignedToMeTreeData(allProjectsData);
          console.log(
            'fetchProjectAssignedToMe ~ allProjectsData:',
            allProjectsData
          );
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchProjectAssignedToMe();
  }, []);

  const handleCreateProject = () => {
    form.resetFields();
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

  const onFinishEdit = async (values) => {
    try {
      const type = editModalType;
      let endpoint;
      let requestData;
      switch (type) {
        case 'Project':
          endpoint = `${config.apiUrl}/updateProject`;
          requestData = {
            projectId: editModalData._id,
            ...values,
          };
          break;
        case 'Milestone':
          endpoint = `${config.apiUrl}/editMilestone`;
          requestData = {
            milestoneId: editModalData._id,
            ...values,
          };
          break;
        case 'Task':
          endpoint = `${config.apiUrl}/editTask`;
          requestData = {
            taskId: editModalData._id,
            ...values,
          };
          break;
        default:
          throw new Error('Invalid type');
      }
      const response = await axios.post(endpoint, requestData, {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.isSuccess) {
        message.success('Operation successful');
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      editForm.resetFields();
      setShowEditProjectModal(false);
      setShowEditMileStoneModal(false);
      setShowEditTaskModal(false);
      fetchProject();
    }
  };

  const onFinishCreateMilestone = async (values) => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/createMilestone`,
        { assignedBy, ...values },
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
    // If adding on Sub task
    if (showTaskModal2) {
      let projectId = '';
      let milestoneId = '';

      if (values.milestoneId) {
        const selectedNode = findNodeById(assignedToMeTreeData, values.milestoneId);
        milestoneId = values.milestoneId
        projectId = selectedNode.projectId;
      } else if (values.parentTaskId) {
        const selectedNode = findNodeById(assignedToMeTreeData, values.parentTaskId);
        console.log("onFinishTaskCreation ~ selectedNode:", selectedNode)
        projectId = selectedNode.projectId;
        milestoneId = selectedNode.milestoneId;
      }

      values = { ...values, projectId, milestoneId };
    }

    try {
      const response = await axios.post(
        `${config.apiUrl}/createTask`,
        {
          assignedBy,
          ...values,
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
    form.resetFields();
    setShowTaskModal(true);
  };

  const handleCreateTaskOnAssigned = () => {
    form.resetFields();
    setShowTaskModal2(true);
    setAssingedTaskSubTaskCreatin(true);
  };

  const handleCreateMilestone = () => {
    form.resetFields();
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
    setShowTaskModal2(false);
  };
  const handleProjectSelect = (value) => {
    setSelectedProject(value);
  };
  const handleMileStoneSelect = (value) => {
    setselectedMileStone(value);
  };
  const handleDelete = async (type, id) => {
    try {
      let response;
      if (type === 'Project') {
        response = await axios.post(
          `${config.apiUrl}/deleteProject`,
          { projectId: id },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else if (type === 'Milestone') {
        response = await axios.post(
          `${config.apiUrl}/deleteMilestone`,
          { milestoneId: id ,assignee:assignedBy},
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else if (type === 'Task') {
        response = await axios.post(
          `${config.apiUrl}/deleteTask`,
          { taskId: id ,assignee:assignedBy},
          {
            headers: {
              Authorization: token,
            },
          }
        );
      }
      message.success('Delete successful');
    } catch (error) {
      message.error('Something Went Wrong');
    } finally {
      fetchProject();
    }
  };

  const handleEdit = (type, id) => {
    const selectedNode = findNodeById(treeData, id);
    if (selectedNode) {
      setEditModalData(selectedNode);
      setEditModalType(type);

      // Update initial values of editForm
      editForm.setFieldsValue({
        name: selectedNode.name,
        description: selectedNode.description,
        timeframe: selectedNode.timeframe,
      });

      if (type === 'Project') {
        setShowEditProjectModal(true);
      } else if (type === 'Milestone') {
        setShowEditMileStoneModal(true);
      } else if (type === 'Task') {
        selectedNode.projectId && setSelectedProject(selectedNode.projectId);

        selectedNode.milestoneId &&
          setselectedMileStone(selectedNode.milestoneId);
        setIsTask(!selectedNode.parentTaskId);
        setShowEditTaskModal(true);
      }
    } else {
      console.log('Node not found with ID:', id);
    }
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
    const selectedNode = findNodeById(treeData, id);
    const selectedNode2 = findNodeById(assignedToMeTreeData, id);
    if (selectedNode) {
      setShowDetailModal(selectedNode);
    } else if(selectedNode2) {
      setShowDetailModal(selectedNode2);
    }
  };

  const onDetailsModalCancel = () => {
    setShowDetailModal(null);
  };

  const handleCancelEditProject = () => {
    editForm.resetFields();
    setEditModalData({});
    setShowEditProjectModal(false);
  };
  const handleCancelEditMileStone = () => {
    editForm.resetFields();
    setEditModalData({});
    setShowEditMileStoneModal(false);
  };
  const handleCancelEditTask = () => {
    editForm.resetFields();
    setEditModalData({});
    setShowEditTaskModal(false);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1200px', padding: '20px' }}>
          <Tabs
            defaultActiveKey="createdByMe"
            onChange={handleTabChange}
            centered
          >
            <TabPane tab="Created By Me" key="createdByMe">
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
            </TabPane>
            <TabPane tab="Assigned to Me" key="assignedToMe">
              <Flex justify="center" gap={24} style={{ marginBottom: '40px' }}>
                <Button type="primary" onClick={handleCreateTaskOnAssigned}>
                  Create Task
                </Button>
              </Flex>

              <Flex justify="center" align="flex-start" wrap="wrap" gap={24}>
                {assignedToMeTreeData.map((project) => (
                  <Card className="w-[90%]" key={project.key}>
                    <ProjectTree
                      data={[project]}
                      onNodeSelect={handleTreeNodeSelection}
                    />
                  </Card>
                ))}
              </Flex>
            </TabPane>
          </Tabs>
        </div>
      </div>

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
      {/* Edit Project */}
      <Modal
        title="Edit Project"
        visible={showEditProjectModal}
        onCancel={handleCancelEditProject}
        footer={null}
      >
        <Card>
          <Form
            form={editForm}
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
              name: editModalData?.name || '',
              description: editModalData?.description || '',
            }}
            onFinish={onFinishEdit}
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
            {/* <Form.Item
              label="Timeframe"
              name="timeframe"
              rules={[
                { required: true, message: 'Please Select a Time Frame!' },
              ]}
            >
              <RangePicker
              // value={selectedTimeframe}
              // onChange={setSelectedTimeframe}
              />
            </Form.Item> */}

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Flex justify="space-between">
                <Button htmlType="submit" type="primary">
                  Save Changes
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      {/* Edit MileStone */}
      <Modal
        title="Edit Milestone"
        visible={showEditMileStoneModal}
        onCancel={handleCancelEditMileStone}
        footer={null}
      >
        <Card>
          <Form
            form={editForm}
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
              name: editModalData?.name || '',
              description: editModalData?.description || '',
              assignee: editModalData?.assignee || '',
              projectId: editModalData?.projectId || '',
            }}
            onFinish={onFinishEdit}
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
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Flex justify="space-between">
                <Button htmlType="submit" type="primary">
                  Save Changes
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      {/* Edit Task */}
      <Modal
        title="Edit Task"
        visible={showEditTaskModal}
        onCancel={handleCancelEditTask}
        footer={null}
      >
        <Card>
          <Form
            form={editForm}
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
              name: editModalData?.name || '',
              description: editModalData?.description || '',
              assignee: editModalData?.assignee || '',
              projectId: editModalData?.projectId || '',
              milestoneId: editModalData?.milestoneId || '',
              // parentTaskId: editModalData?.parentTaskId || '',
            }}
            onFinish={onFinishEdit}
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
                initialValue={editModalData?.parentTaskId || ''}
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
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Flex justify="space-between">
                <Button htmlType="submit" type="primary">
                  Save Changes
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
        title="Create Task"
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

      <Modal
        title="Create Task"
        open={showTaskModal2}
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

            {isTask ? (
              <Form.Item
                label="Select Milestone"
                name="milestoneId"
                rules={[
                  { required: true, message: 'Please select a Milestone!' },
                ]}
              >
                <Select onChange={handleMileStoneSelect}>
                  {assignedToMeTreeData
                    .filter((item) => item.itemType === 'milestone')
                    .map((milestone) => (
                      <Option key={milestone._id} value={milestone._id}>
                        {milestone.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            ) : (
              <Form.Item
                label="Select Task"
                name="parentTaskId"
                rules={[{ required: true, message: 'Please select a task!' }]}
              >
                <Select onChange={handleMileStoneSelect}>
                  {assignedToMeTreeData
                    .filter((item) => item.itemType === 'task')
                    .map((task) => (
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
      assignedBy={assignedBy}
        visible={showDetailModal}
        data={showDetailModal}
        onCancel={onDetailsModalCancel}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </>
  );
};
export default AddProject;
