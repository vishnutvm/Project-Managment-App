import React, { useState, useEffect } from "react";
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
} from "antd";
import Forms from "../../Components/CommonForm/TaskForms";
import TaskForms from "../../Components/CommonForm/TaskForms";
import axios from "axios";
import config from "../../Config/Config";
import MilestoneForm from "../../Components/CommonForm/MilestoneForm";
import { useSelector } from "react-redux";
import { getProjectDetails } from "../../Redux/ProjectReducer";
import { useDispatch } from "react-redux";
const editProject = (key) => {
  console.log("Edit project: ", key);
  // Add your edit logic here
};

const deleteProject = (key) => {
  console.log("Delete project: ", key);
  // Add your delete logic here
};

// It's just a simple demo. You can use tree map to optimize update perf.
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
  const userDetails = useSelector((state) => state.user.loginUserDetails);
  const projectDetails = useSelector((state) => state.project.projectDetails);
  console.log("projectdetails", projectDetails);
  const projectId = projectDetails[projectDetails.length - 1]._id;
  // const milestoneId =
  //   projectDetails[projectDetails.length - 1].milestones[
  //     projectDetails[projectDetails.length - 1].milestones.length - 1
  //   ]._id;
  // console.log("fkkfk", milestoneId);

  const token = userDetails.tokens[userDetails.tokens.length - 1];
  const memberList = userDetails.members;
  const assignedBy = userDetails._id;
  const dispatch = useDispatch();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [Project, setProject] = useState({});
  const [allProjects, setAllProjects] = useState({});
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
      console.log("rrrrr", response);
      if (response.data.isSuccess) {
        dispatch(getProjectDetails(response?.data?.response));
        const projects = response?.data.response.map((project, index) => ({
          title: project.name,
          key: project._id,
          isLeaf: false,
        }));
        setTreeData(projects);
      }
    } catch (error) {
      alert(error.response.data.error);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchProject();
    // fetchData();
  }, []);
  // console.log("dfwfn",treeData);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/getProject`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("responsegetpr", response);
    } catch (error) {
      alert(error.response.data.error);
      console.error("Error fetching data:", error);
    }
  };

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
      console.log("res", response);
      if (response.data.isSuccess) {
        setMilestone(response.data.response);
        setShowMilestoneModal(false);
        message.success("milestone created");

        form.resetFields("");
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.log("error");
    }
  };
  const onFinishTaskCreation = async (values) => {
    console.log("values", values);
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
      console.log("res", response);
      if (response.data.isSuccess) {
        setTask(response.data.response);
        setShowTaskModal(false)
        message.success('task added')
        form.resetFields("");
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.log("error");
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
    console.log("values", values);
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
      console.log("res", response);
      if (response.data.isSuccess) {
        message.success("project created");
        setProject(response.data.response);
        setShowProjectModal(false);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.log("error");
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
  const [treeData, setTreeData] = useState([]);
  const [form] = Form.useForm();
  const onLoadData = async ({ key, children }) => {
    if (children) {
      return;
    }

    const projectId = key;

    try {
      const response = await axios.post(
        `${config.apiUrl}/getProjectList`,
        { projectId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.isSuccess) {
        const project = response.data.response.find(
          (proj) => proj._id === projectId
        );
        const projectMilestones = project?.milestones;

        if (projectMilestones && projectMilestones.length > 0) {
          const milestones = projectMilestones.map((milestone) => ({
            title: milestone.name,
            key: `${projectId}-${milestone._id}`, // Unique key for each milestone
            isLeaf: true,
          }));

          setTreeData((origin) => updateTreeData(origin, key, milestones));
        } else {
          console.log("Project ID:", project._id);
          console.log("No milestones found for this project.");
        }
      }
    } catch (error) {
      console.error("Error fetching milestones:", error);
      message.error("Error fetching milestones");
    }
  };

  return (
    <>
      <Flex gap={6}>
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

      <Tree loadData={onLoadData} treeData={treeData} />
      <Modal
        title="Create Project"
        open={showProjectModal}
        onOk={handleProjectModalOk}
        onCancel={handleCancel}
        footer={false}
      >
        {/* Form for creating a new project */}
        {/* <h1 className="mt-9 ml-7 font-semibold text-2xl">Create Project</h1> */}
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
            <Form.Item
              label="Name"
              name="name"
              //   rules={[
              //     {
              //       required: true,
              //       message: 'Please input your description!',
              //     },
              //   ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              //   rules={[
              //     {
              //       required: true,
              //       message: 'Please input your description!',
              //     },
              //   ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Assign to" name="assignee">
              <Select>
                {memberList.map((friend) => (
                  <Option value={friend._id}>{friend.email}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Timeframe"
              name="timeframe"
              //   rules={[
              //     {
              //       required: true,
              //       message: 'Please input!',
              //     },
              //   ]}
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
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
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
            <Form.Item
              label="Name"
              name="name"
              //   rules={[
              //     {
              //       required: true,
              //       message: 'Please input your description!',
              //     },
              //   ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              //   rules={[
              //     {
              //       required: true,
              //       message: 'Please input your description!',
              //     },
              //   ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Assign to" name="assignee">
              <Select>
                {memberList.map((friend) => (
                  <Option value={friend._id}>{friend.email}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Timeframe"
              name="timeframe"
              //   rules={[
              //     {
              //       required: true,
              //       message: 'Please input!',
              //     },
              //   ]}
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
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </>
  );
};
export default AddProject;
