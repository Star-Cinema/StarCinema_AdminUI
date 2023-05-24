import { React, useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { Tooltip, Modal, Form, Input, notification } from "antd";

//START REGION
//VYVNK1 FUNC UPDATE CATEGORY
const CategoryUpdate = ({ id, name, loadData }) => {
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
    id: id,
    name: name,
  });
  const [beError, setBeError] = useState("");
  const [displayErr, setdisplayErr] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  // VYVNK1 FUNCTION CREATE CATEGORY
  const handleCreate =  async () => {

     await axios
      .put(`https://localhost:7113/api/Categories/${formData.id}`, formData)
      .then(function (response) {
        setIsModalOpen(false);
        loadData();
        notification.open({
          message: "Notification",
          description: "Update Category successfully!",
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

  //set initial value of Input field
  useEffect(() => {
    form.setFieldsValue({
      name: name,
    });
  }, [name]);

  return (
    <>
      <Tooltip title="Edit">
        <a onClick={showModal}>
          <EditOutlined style={{ color: "#1890ff" }} />
        </a>
      </Tooltip>

      <Modal
      
        getContainer={false}
        visible={isModalOpen}
        title="Edit category"
        okText="Update"
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
            
          }}
        >
          <Form.Item
            onChange={(e) => handleChange(e)}
            name="id"
            label="Category Id"
          >
            <Input disabled={true} defaultValue={id} />
          </Form.Item>
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
            <Input  />
          </Form.Item>
          
          
        </Form>
      </Modal>

      {/* Display back end Error Message of create */}
      <Modal
        title="Error Message"
        visible={displayErr}
        onOk={handleOkErr}
        onCancel={handleCancelErr}
        cancelButtonProps={{ style: { display: "none" } }}
        // footer={null}
      >
        <p style={{ color: "red" }}>{beError}</p>
      </Modal>
    </>
  );
};

export default CategoryUpdate;
