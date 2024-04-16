import React, { useState } from 'react';
import { Modal, Button, Descriptions, Alert, Progress, Badge } from 'antd';

const DetailModal = ({
  visible = {},
  data = {},
  type = '',
  onCancel = () => {},
  onDelete = () => {},
  onEdit = () => {},
}) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowConfirmDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(data._id);
    setShowConfirmDeleteModal(false);
    onCancel();
  };

  const handleEdit = () => {
    onEdit(data._id);
  };

  const handleClose = () => {
    onCancel();
  };

  return (
    <>
      {/* Confirmation modal for delete action */}
      <Modal
        title="Confirm Delete"
        visible={showConfirmDeleteModal}
        onCancel={() => setShowConfirmDeleteModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowConfirmDeleteModal(false)}>
            Cancel
          </Button>,
          <Button key="delete" type="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>,
        ]}
        centered
      >
        <p>Are you sure you want to delete this {type}?</p>
      </Modal>

      {/* Main detail modal */}
      <Modal
        title={`${type.charAt(0).toUpperCase() + type.slice(1)} Details`}
        visible={visible}
        onCancel={handleClose}
        footer={[
          <Button key="edit" onClick={handleEdit}>
            Edit
          </Button>,
          <Button key="delete" type="danger" onClick={handleDelete}>
            Delete
          </Button>,
        ]}
      >
        <Descriptions column={1}>
          <Descriptions.Item label="Name">
            {data?.description}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {data?.description}
          </Descriptions.Item>
          {/* Project */}
          {data?.projectStatus && (
            <div>
              <Descriptions column={2}>
                {data.timeframe && data?.timeframe?.length > 1 && (
                  <Descriptions.Item label="Timeframe">
                    {data.timeframe[0]} - {data.timeframe[1]}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Percentage">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        marginRight: '8px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#1890ff',
                      }}
                    >
                      {data.projectPercentage}%
                    </span>
                    {/* <div style={{ flex: '1', marginLeft: '12px' }}>
                      <Progress
                        type="circle"
                        percent={data.projectPercentage}
                        width={60}
                      />
                    </div> */}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Project Status">
                  <Badge
                    status={
                      data.projectStatus === 'open' ? 'processing' : 'success'
                    }
                    text={data.projectStatus.toUpperCase()}
                  />
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}

          {/* Milestone */}
          {data?.milestoneStatus && (
            <div>
              <Descriptions column={2}>
                {data.timeframe && data?.timeframe?.length > 1 && (
                  <Descriptions.Item label="Timeframe">
                    {data.timeframe[0]} - {data.timeframe[1]}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Percentage">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        marginRight: '8px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#1890ff',
                      }}
                    >
                      {data.projectPercentage}%
                    </span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Project Status">
                  <Badge
                    status={
                      data.projectStatus === 'open' ? 'processing' : 'success'
                    }
                    text={data.projectStatus.toUpperCase()}
                  />
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
          {data?.taskStatus && (
            <div>
              <Descriptions column={2}>
                {data.timeframe && data?.timeframe?.length > 1 && (
                  <Descriptions.Item label="Timeframe">
                    {data.timeframe[0]} - {data.timeframe[1]}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Percentage">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        marginRight: '8px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#1890ff',
                      }}
                    >
                      {data.projectPercentage}%
                    </span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Project Status">
                  <Badge
                    status={
                      data.projectStatus === 'open' ? 'processing' : 'success'
                    }
                    text={data.projectStatus.toUpperCase()}
                  />
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Descriptions>
      </Modal>
    </>
  );
};

export default DetailModal;
