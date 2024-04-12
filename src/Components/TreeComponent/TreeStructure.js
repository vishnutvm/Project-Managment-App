import React, { useState } from "react";
import { Tree, Card,Flex } from "antd";

const projectsData = [
  {
    title: "Project 1",
    key: "0-0",
    children: [
      {
        title: "Milestone 1",
        key: "0-0-0",
        children: [
          {
            title: "Task 1",
            key: "0-0-0-0",
            children: [
              {
                title: "Subtask 1",
                key: "0-0-0-0-0",
              },
              {
                title: "Subtask 2",
                key: "0-0-0-0-1",
              },
            ],
          },
          {
            title: "Task 2",
            key: "0-0-0-1",
            children: [
              {
                title: "Subtask 1",
                key: "0-0-0-1-0",
              },
            ],
          },
          {
            title: "Task 3",
            key: "0-0-0-2",
          },
        ],
      },
      {
        title: "Milestone 2",
        key: "0-0-1",
        children: [
          {
            title: "Task 1",
            key: "0-0-1-0",
          },
          {
            title: "Task 2",
            key: "0-0-1-1",
            children: [
              {
                title: "Subtask 1",
                key: "0-0-1-1-0",
              },
              {
                title: "Subtask 2",
                key: "0-0-1-1-1",
              },
            ],
          },
          {
            title: "Task 3",
            key: "0-0-1-2",
          },
        ],
      },
    ],
  },
  {
    title: "Project 2",
    key: "1-1",
    children: [
      {
        title: "Milestone 1",
        key: "0-0-0",
        children: [
          {
            title: "Task 1",
            key: "0-0-0-0",
            children: [
              {
                title: "Subtask 1",
                key: "0-0-0-0-0",
              },
              {
                title: "Subtask 2",
                key: "0-0-0-0-1",
              },
            ],
          },
          {
            title: "Task 2",
            key: "0-0-0-1",
            children: [
              {
                title: "Subtask 1",
                key: "0-0-0-1-0",
              },
            ],
          },
          {
            title: "Task 3",
            key: "0-0-0-2",
          },
        ],
      },
      {
        title: "Milestone 2",
        key: "0-0-1",
        children: [
          {
            title: "Task 1",
            key: "0-0-1-0",
          },
          {
            title: "Task 2",
            key: "0-0-1-1",
            children: [
              {
                title: "Subtask 1",
                key: "0-0-1-1-0",
              },
              {
                title: "Subtask 2",
                key: "0-0-1-1-1",
              },
            ],
          },
          {
            title: "Task 3",
            key: "0-0-1-2",
          },
        ],
      },
    ],
  },
  {
    title: "Project 3",
    key: "2-2",
    children: [
      {
        title: "Milestone 1",
        key: "0-0-0",
        children: [
          {
            title: "Task 1",
            key: "0-0-0-0",
            children: [
              {
                title: "Subtask 1",
                key: "0-0-0-0-0",
              },
              {
                title: "Subtask 2",
                key: "0-0-0-0-1",
              },
            ],
          },
          {
            title: "Task 2",
            key: "0-0-0-1",
            children: [
              {
                title: "Subtask 1",
                key: "0-0-0-1-0",
              },
            ],
          },
          {
            title: "Task 3",
            key: "0-0-0-2",
          },
        ],
      },
      {
        title: "Milestone 2",
        key: "0-0-1",
        children: [
          {
            title: "Task 1",
            key: "0-0-1-0",
          },
          {
            title: "Task 2",
            key: "0-0-1-1",
            children: [
              {
                title: "Subtask 1",
                key: "0-0-1-1-0",
              },
              {
                title: "Subtask 2",
                key: "0-0-1-1-1",
              },
            ],
          },
          {
            title: "Task 3",
            key: "0-0-1-2",
          },
        ],
      },
    ],
  },
  
];

const TreeStructure = () => {
  const [expandedKeys, setExpandedKeys] = useState(["0-0-0", "0-0-1"]);
  const [checkedKeys, setCheckedKeys] = useState(["0-0-0"]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(false);

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };

  return (
    <Flex justify="flex-start" align="flex-start" >
    {projectsData.map((project) => (
      <Card className="w-[30%] ml-3 mt-6" key={project.key}>
        <Tree
        // key={project.key}
          checkable
          onExpand={onExpand}
        //   expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          treeData={[project]}
        />
      </Card>
    ))}
  </Flex>
);
};
export default TreeStructure;
