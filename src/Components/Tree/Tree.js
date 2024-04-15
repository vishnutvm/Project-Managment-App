import React, {  useMemo } from 'react';
import { Tree } from 'antd';

const buildTreeData = (data) => {
  return data.map((item) => ({
    title: item.name,
    key: item._id,
    children: item.milestones
      ? buildTreeData(item.milestones)
      : item.tasks
      ? buildTreeData(item.tasks)
      : [],
  }));
};

// Component to Render The Tree Structure of any Project task Hirarchy, Need to Pass data parameters , each elements the tree need a unique id
const ProjectTree = ({ data }) => {
  const treeData = useMemo(() => buildTreeData(data), [data]);

  return (
    <Tree
      treeData={treeData}
    />
  );
};

export default ProjectTree;
