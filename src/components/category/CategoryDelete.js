import { React, useState, useEffect } from "react";
import {DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { Tooltip, Modal, notification } from "antd";

const CategoryDelete = ({ id, name, loadData }) => {
  const onDelete = (id, name) => {
    Modal.confirm({
      title: `Do you want to delete Category ${name}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await axios
          .delete(`https://localhost:7113/api/Categories/${id}`, {
            data: { foo: "bar" },
          })
          .then((response) => response.data)
          .catch((error) => console.error(error));
        loadData();
        notification.open({
            message: "Notification",
            description: "Delete Category successfully!",
            duration: 3,
            placement: "topRight",
            
          });
      },
    });
  };
  return (
    <Tooltip title="Delete">
      <a onClick={() => onDelete(id, name)}>
        <DeleteOutlined style={{ color: "red" }} />
      </a>
    </Tooltip>
  );
};
export default CategoryDelete;
