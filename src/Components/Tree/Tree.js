import React, { useMemo } from 'react';
import { Tree } from 'antd';

const buildTreeData = (data) => {
  return data.map((item) => ({
    title: `${item.name} - ${item.projectPercentage ? `(${item.projectPercentage})` : ''} ${item.currentPercentage ? `(${item.currentPercentage})` : '0%'}`,
    key: item._id,
    children: item.milestones
      ? buildTreeData(item.milestones)
      : item.tasks
      ? buildTreeData(item.tasks)
      : [],
  }));
};

const ProjectTree = ({ data, onNodeSelect = () => {} }) => {
  const treeData = useMemo(() => buildTreeData(data), [data]);

  const handleNodeSelect = (selectedKeys = [], info) => {
    onNodeSelect(selectedKeys[0]);
  };

  return <Tree treeData={treeData} onSelect={handleNodeSelect} />;
};

export default ProjectTree;
