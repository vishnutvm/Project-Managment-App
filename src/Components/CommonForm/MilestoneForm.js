// import React, { useState } from "react";
// import {
//   Layout,
//   Button,
//   Card,
//   Flex,
//   Form,
//   Input,
//   DatePicker,
//   Avatar,
//   Select,
//   List,
//   message,
// } from "antd";
// import config from "../../Config/Config";
// import axios from "axios";
// import { useSelector } from "react-redux";
// const { Option } = Select;
// const { RangePicker } = DatePicker;

// function MilestoneForm({ onFinishCreateMilestone }) {
//   const userDetails = useSelector((state) => state.user.loginUserDetails);
//   const memberList=userDetails.members
//   console.log("memberlist",memberList);
//   const token = userDetails.tokens[userDetails.tokens.length - 1];


//   const [frndList] = useState([
//     { id: 1, name: "Friend 1" },
//     { id: 2, name: "Friend 2" },
//     { id: 3, name: "Friend 3" },
//     { id: 4, name: "Friend 4" },
//     { id: 5, name: "Friend 5" },
//   ]);



//   const onFinishFailed = () => {
//     console.log("dddd");
//   };
//   return (
//     <Card>
//       <Form
//         className="mt-8  w-full"
//         name="basic"
//         labelCol={{
//           span: 8,
//         }}
//         wrapperCol={{
//           span: 24,
//         }}
//         style={{
//           maxWidth: 700,
//         }}
//         initialValues={{
//           remember: true,
//         }}
//         onFinish={onFinishMilestoneCreation}
//         onFinishFailed={onFinishFailed}
//         autoComplete="off"
//       >
//         <Form.Item
//           label="Name"
//           name="name"
//           //   rules={[
//           //     {
//           //       required: true,
//           //       message: 'Please input your description!',
//           //     },
//           //   ]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Description"
//           name="description"
//           //   rules={[
//           //     {
//           //       required: true,
//           //       message: 'Please input your description!',
//           //     },
//           //   ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item label="Assign to" name="assignee">
//           <Select>
//             {memberList.map((friend) => (
//               <Option key={friend.id} value={friend.id}>
//                 {friend.email}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           label="Timeframe"
//           name="timeframe"
//           //   rules={[
//           //     {
//           //       required: true,
//           //       message: 'Please input!',
//           //     },
//           //   ]}
//         >
//           <RangePicker />
//         </Form.Item>

//         <Form.Item
//           wrapperCol={{
//             offset: 8,
//             span: 16,
//           }}
//         >
//           <Flex justify="space-between">
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </Flex>
//         </Form.Item>
//       </Form>
//     </Card>
//   );
// }

// export default MilestoneForm;
