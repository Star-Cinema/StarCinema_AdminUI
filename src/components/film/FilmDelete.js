import { React, useState, useEffect } from "react";
import {DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { Tooltip, Modal, notification } from "antd";


// DELETE FILM
const FilmDelete = ({ id, name, loadData }) => {

//START REGION
//VYVNK1 FUNCTION DELETE FILM
  const onDelete = (id, name) => {
    Modal.confirm({
      title: `Do you want to delete Film ${name}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await axios
          .delete(`https://localhost:7113/api/Films/${id}`, {
            data: { foo: "bar" },
          })
          .then((response) => (response.data))
          .catch((error) => console.error(error));
          
        loadData();
        notification.open({
            message: "Notification",
            description: "Delete Film successfully!",
            duration: 3,
            placement: "topRight",
            
          });
      },
    });
  };
  // END REGION

  //START REGION
  //VYVNK1 UI OF DELETE FILM
  
  return (
    <Tooltip title="Delete">
      <a onClick={() => onDelete(id, name)}>
        <DeleteOutlined style={{ color: "red" }} />
      </a>
    </Tooltip>
  );
};
export default FilmDelete;
