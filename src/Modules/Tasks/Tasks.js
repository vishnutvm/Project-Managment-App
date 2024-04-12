import React, { useState,useEffect } from 'react';
import { Radio, Space, Table, Tag,Card,Checkbox,Select} from 'antd';
import axios from "axios"
import config from '../../Config/Config';
import {useSelector} from "react-redux"


const columns = [
    {
      title: 'Checkbox',
      dataIndex: 'checkbox',
      key: 'checkbox',
      render: (_, record) => <Checkbox onChange={(e) => console.log(e.target.checked)} />,
    },
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
        <Select defaultValue="open" onChange={(value) => console.log(value)}>
          <Option value="open">Open</Option>
          <Option value="ongoing">Ongoing</Option>
          <Option value="completed">Completed</Option>
        </Select>
      ),
    },
  ];
  const { Option } = Select;
  



const data = [
    { key: '1', name: 'Task 1', dueDate: '2024-04-15', status: 'open' },
    { key: '2', name: 'Task 2', dueDate: '2024-04-20', status: 'completed' },
    { key: '3', name: 'Task 3', dueDate: '2024-04-25', status: 'ongoing' },
    { key: '3', name: 'Task 4', dueDate: '2024-04-25', status: 'open' },
  ];
const Tasks = () => {
    const userDetails = useSelector((state) => state.user.loginUserDetails);
    const token = userDetails.tokens[userDetails.tokens.length - 1];
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.post(`${config.apiUrl}/getTask`, {}, {
              headers: {
                Authorization: token,
              },
            });
            console.log("responsegetpr", response);
          } catch (error) {
            alert(error.response.data.error)
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, []);
  const [top, setTop] = useState('topLeft');
  const [bottom, setBottom] = useState('bottomRight');
  return (
    
      <div>
        
        <h1 className="mt-9 ml-11 font-semibold text-2xl">Task Details</h1>
      <Card className="w-[90%] ml-10 mt-6 ">
      <Table
        columns={columns}
       
        dataSource={data}
      />
      </Card>
    </div>
  );
};
export default Tasks;