import React, { useState, useEffect } from "react";
import {
  Flex,
  Button,
  Space,
  Input,
  Avatar,
  List,
  Card,
  Drawer,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import SearchBar from "../../Components/SearchBar/SearchBar";
import { useSelector } from "react-redux";
import axios from "axios";
import config from "../../Config/Config";

function Members() {
  const userDetails = useSelector((state) => state.user.loginUserDetails);
  console.log("userdetails", userDetails);
  let members = userDetails.members;
  console.log("uuuu", members);
  let incomingRequests = userDetails.incomingRequests;
  console.log("incoming", incomingRequests);
  let outGoingRequests = userDetails.outgoingRequests;
  let senderEmail = userDetails.email;
  console.log(senderEmail);
  const token = userDetails.tokens[userDetails.tokens.length - 1];
  const { Search } = Input;
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [showMembers, setShowMembers] = useState(false);
  const [showRequests, setShowRequests] = useState(true);
  const [showSendRequests, setShowSendRequests] = useState(false);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [selectedButton, setSelectedButton] = useState("memberRequests");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const handleSearch = (value) => {
    setSearchValue(value);
    console.log("searchValue");
  };
  const searchName = async () => {
    // setSearchValue(value);

    try {
      const response = await axios.post(
        `${config.apiUrl}/getUser`,
        { email: searchValue },

        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("res1", searchResult);

      if (response.data.isSuccess) {
        setSearchResult(response.data.response);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };

  console.log("hu");
  const handleRequestSend = async () => {
    console.log("search", searchResult);
    try {
      const response = await axios.post(
        `${config.apiUrl}/sendRequest`,
        { receiverEmail: searchResult.email },

        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("res1", searchResult);

      if (response.data.isSuccess) {
        setSearchResult(response.data.response);
        message.success("request send successfully");
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.log("error");
    }
  };
  const handleAcceptRequest = async () => {
    try {
      console.log("dd");
      const response = await axios.post(
        `${config.apiUrl}/acceptOrRejectRequest`,
        { senderEmail, status: "accepted" },

        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("res1", searchResult);

      if (response.data.isSuccess) {
        //   setSearchResult(response.data.response)
        //   message.success("request send successfully")
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <div>
      <Flex className="justify-between">
        <h1 className="mt-9 ml-9 font-semibold text-2xl">Members</h1>
        <Button type="primary" className="mt-9 mr-6" onClick={showDrawer}>
          Add Member
        </Button>
      </Flex>
      <Card className="w-[93%] ml-9  mt-6 ">
        <Flex className="ml-8 mt-6" gap={6}>
          <Button
            style={{
              backgroundColor:
                selectedButton === "memberList" ? "#3EC0601A" : "",
            }}
            onClick={() => {
              setShowMembers(true);
              setShowRequests(false);
              setShowSendRequests(false);
              setSelectedButton("memberList");
            }}
          >
            Member List
          </Button>
          <Button
            style={{
              backgroundColor:
                selectedButton === "memberRequests" ? "#3EC0601A" : "",
            }}
            onClick={() => {
              setShowRequests(true);
              setShowMembers(false);
              setShowSendRequests(false);
              setSelectedButton("memberRequests");
            }}
          >
            Member Requests
          </Button>
          <Button
            style={{
              backgroundColor:
                selectedButton === "requestSend" ? "#3EC0601A" : "",
            }}
            onClick={() => {
              setSelectedButton("requestSend");
              setShowSendRequests(true);
              setShowRequests(false);
              setShowMembers(false);
            }}
          >
            Request Send
          </Button>
        </Flex>
        {showMembers && (
          <List
            className="ml-8 mt-6"
            itemLayout="horizontal"
            dataSource={members}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={<a href="#">{item.email}</a>}
                />
                <Button
                  style={{
                    borderColor: "red",
                    color: "red",
                    marginRight: "55px",
                  }}
                >
                  Remove
                </Button>
              </List.Item>
            )}
          />
        )}

        {showRequests && (
          <List
            className="ml-8 mt-6"
            itemLayout="horizontal"
            dataSource={incomingRequests}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  //   avatar={<Avatar icon={<UserOutlined />} />}
                  title={<a href="#">{item.senderName}</a>}
                />
                <Button
                  style={{
                    borderColor: "green",
                    color: "green",
                    marginRight: "55px",
                  }}
                  onClick={handleAcceptRequest}
                >
                  Accept
                </Button>
                <Button
                  style={{
                    borderColor: "red",
                    color: "red",
                    marginRight: "55px",
                  }}
                >
                  Reject
                </Button>
              </List.Item>
            )}
          />
        )}
        {showSendRequests && (
          <List
            className="ml-8 mt-6"
            itemLayout="horizontal"
            dataSource={outGoingRequests}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={<a href="#">{item.receiverEmail}</a>}
                />
                <Button
                  style={{
                    borderColor: "green",
                    color: "green",
                    marginRight: "55px",
                  }}
                >
                  Requested
                </Button>
                <Button
                  style={{
                    borderColor: "red",
                    color: "red",
                    marginRight: "55px",
                  }}
                >
                  cancel
                </Button>
              </List.Item>
            )}
          />
        )}
      </Card>
      <Drawer
        title="Add Members"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
      >
        <Search
          placeholder="Search members"
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={searchName}
        />
        <List
          className="ml-8 mt-6"
          itemLayout="horizontal"
          dataSource={searchResult ? [searchResult] : []}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={<a href="#">{item.name}</a>}
                description={
                  <Button onClick={handleRequestSend}>Send Request</Button>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
}

export default Members;
