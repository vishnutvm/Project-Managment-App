import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Select } from 'antd';
import axios from 'axios';
import config from '../../Config/Config';
import { useSelector } from 'react-redux';
import moment from 'moment';
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
          // var allTasksData = response.data.data.data
          //   // .filter((item) => item.itemType === 'task')
          //   .map((item) => ({
          //     ...item.details,
          //     itemType: item.itemType,
          //   }));
          var allTasksData = response?.data?.data?.data?.map((item) => ({
            ...item.details,
            itemType: item.itemType,
          }));
          console.log('fetchProjectAssignedToMe ~ allTasksData:', allTasksData);

          // Mapping to desired format
          allTasksData = allTasksData.map((item) => ({
            key: item._id,
            name: item.name,
            dueDate:
              item.timeframe &&
              Array.isArray(item.timeframe) &&
              item.timeframe.length > 0
                ? moment(item.timeframe[0].end).format('YYYY-MM-DD')
                : '_',
            status: item.taskStatus || item.milestoneStatus,
            projectId: item.projectId,
            milestoneId: item.milestoneId,
            itemType :item.itemType
          }));

          setAllTasks(allTasksData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onFinishEdit = async (values, record) => {
    console.log("onFinishEdit ~ record:", record)
    var { projectId, milestoneId, key } = record;
    try {
      const endpoint = `${config.apiUrl}/updateProjectStatus`;
      var requestData = {};
      if (record.itemType === 'milestone') {
        requestData = {
          projectId: projectId,
          milestoneId: key,
          status: values,
          itemType: 'milestone',
        };
      } else {
        requestData = {
          projectId: projectId,
          milestoneId: milestoneId,
          taskId: key,
          status: values,
          itemType: 'task',
        };
      }

      await axios.post(endpoint, requestData, {
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      console.error('Error updating project status:', error);
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
          defaultValue={record.status} // Set default value based on task status
          onChange={(value) => onFinishEdit(value, record)}
        >
          <Option value="open">Open</Option>
          <Option value="pending">Pending</Option>
          <Option value="testing">Testing</Option>
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
