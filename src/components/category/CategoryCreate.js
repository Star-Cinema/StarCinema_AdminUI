import { React, useState, useEffect } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { Tooltip, Modal, Button, Form, Input, notification } from "antd";


const CategoryCreate = ({loadData}) => {
  // antd
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOkErr = () => {
    setdisplayErr(false);
  };

  const handleCancelErr = () => {
    setdisplayErr(false);
  };

  
  // end antd

  const [formData, setFormData] = useState({
    name: "",
  });
  const [beError, setBeError] = useState("");
  const [displayErr, setdisplayErr] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const handleCreate =  () => {  
     axios
      .post(`https://localhost:7113/api/Categories`, formData)
      .then(function (response) {
        setIsModalOpen(false);
        loadData();
        notification.open({
          message: "Notification",
          description: "Add Category successfully!",
          duration: 3,
          placement: "topRight",
          
        });
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        setBeError(error.response.data.message);
        setdisplayErr(true);
      });
  };

  return (
    <>
      <Tooltip title="Create Category">
        <Button
          style={{ marginBottom: "1em", background: "transparent" }}
          type="primary"
          onClick={showModal}
        >
          <PlusCircleOutlined style={{ fontSize: "150%", color: "#1890ff" }} />
        </Button>
      </Tooltip>
      <Modal
        visible={isModalOpen}
        title="Create a new category"
        okText="Create"
        cancelText="Back"
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              handleCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            onChange={(e) => handleChange(e)}
            name="name"
            label="Category Name"
            rules={[
              {
                required: true,
                // pattern: new RegExp(/\d+/g),
                message: "Please input the Category name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Display back end Error Message of create */}
      <Modal
        title="Error Message"
        visible={displayErr}
        onOk={handleOkErr}
        onCancel={handleCancelErr}
        cancelButtonProps={{ style: { display: 'none' } }}
        // footer={null}
      >
        <p style={{ color: "red" }}>{beError}</p>
        
      </Modal>

      
    </>
  );
};

export default CategoryCreate;
