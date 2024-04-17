import React, { useState, useEffect } from 'react';
import { Radio, Space, Table, Tag, Card, Checkbox, Select } from 'antd';
import axios from 'axios';
import config from '../../Config/Config';
import { useSelector } from 'react-redux';

const { Option } = Select;

const Tasks = () => {
  const userDetails = useSelector((state) => state.user.loginUserDetails);
  const token = userDetails.tokens[userDetails.tokens.length - 1];
  const [allTasks, setAllTasks] = useState([]);

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
          Array.isArray(response.data.data.data) &&
          response.data.data.data.length > 0
        ) {
          // Mapping and filtering tasks
          var allTasksData = response.data.data.data
            .filter((item) => item.itemType === 'task')
            .map((item) => ({
              ...item.item,
              itemType: item.itemType,
            }));
  
          console.log("fetchProjectAssignedToMe ~ allTasksData2:", allTasksData);
  
          // Mapping to desired format
          allTasksData = allTasksData.map((item) => ({
            key: item._id,
            name: item.name,
            dueDate: item.timeframe?.end,
            status: item.timeframe?.taskStatus,
            projectId: item.projectId,
            milestoneId: item.milestoneId,
          }));
  
          console.log('fetchProjectAssignedToMe ~ allTasksData:', allTasksData);
          setAllTasks(allTasksData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const onFinishEdit = async (values, record) => {
    const { projectId, milestoneId, key } = record;
    try {
      let endpoint;
      let requestData;
      endpoint = `${config.apiUrl}/updateProjectStatus`;
      requestData = {
        projectId: projectId,
        milestoneId: milestoneId,
        taskId: key,
        status: values,
        itemType: 'task',
      };

      const response = await axios.post(endpoint, requestData, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
    } finally {
      fetchProjectAssignedToMe();
    }
  };

  useEffect(() => {
    fetchProjectAssignedToMe();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Select
          defaultValue="open"
          onChange={(value) => onFinishEdit(value, record)}
        >
          <Option value="open">Open</Option>
          <Option value="pending">pending</Option>
          <Option value="testing">testing</Option>
          <Option value="completed">Completed</Option>

        </Select>
      ),
    },
  ];
  return (
    <div>
      <h1 className="mt-9 ml-11 font-semibold text-2xl">Task Details</h1>
      <Card className="w-[90%] ml-10 mt-6 ">
        <Table columns={columns} dataSource={allTasks} />
      </Card>
    </div>
  );
};
export default Tasks;
