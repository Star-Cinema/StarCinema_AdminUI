import { React, useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import {
  Tooltip,
  Modal,
  Form,
  Input,
  notification,
  Select,
  DatePicker,
  Col,
  Row,
} from "antd";
import ImageUpload from "./ImageUpload";
import Test from "./Test";
const { Option } = Select;
const { TextArea } = Input;

const dateFormat = "YYYY/MM/DD";

const FilmUpdate = ({
  id,
  image,
  name,
  category,
  categoryId,
  director,
  producer,
  country,
  description,
  release,
  videoLink,
  duration,
  listCategory,
  loadData,
}) => {
  // START REGION--VYVNK1 State from antd
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
  // END REGION -- end antd

  // START REGION-- VYVNK1 for upload image
  const [imgLink, setImgLink] = useState("");

  const fetchImgLink = (value) => {
    console.log(value);
    setImgLink(value);
    setFormData({
      ...formData,
      image: [
        {
          name: "string",
          path: value,
        },
      ],
    });
    //console.log(formData.image);
  };
  // END REGION--

  const dataTable = {
    id: id,
    image: [
      {
        name: "string",
        path: image,
      },
    ],
    name: name,
    categoryId: categoryId,
    director: director,
    producer: producer,
    country: country,
    description: description,
    release: release,
    videoLink: videoLink,
    duration: duration,
  };
  const [formData, setFormData] = useState(dataTable);
  const [beError, setBeError] = useState("");
  const [displayErr, setdisplayErr] = useState(false);

  // START REGION-- VYVNK1 GET DATE FROM DATEPICKER
  const onSelectDate = (date, dateString) => {
    console.log(date, dateString);
    setFormData({
      ...formData,
      release: date.format("YYYY-MM-DD"),
    });
    console.log(formData);
  };
  // END REGION--

  // START REGION-- VYVNK1 FUNC UPDATE
  const handleCreate = async () => {
    console.log(formData);
    await axios
      .put(`https://localhost:7113/api/Films/${formData.id}`, formData)
      .then(function (response) {
        setIsModalOpen(false);
        loadData();
        notification.open({
          message: "Notification",
          description: "Update Film successfully!",
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
  // END REGION--

  useEffect(() => {
    form.setFieldsValue({
      name: name,
      producer: producer,
      category: category,
      director: director,
      duration: duration,
      country: country,
      description: description,
      videoLink: videoLink,
    });
  }, [
    name,
    producer,
    category,
    director,
    duration,
    country,
    description,
    videoLink,
  ]);

  return (
    <>
      <Tooltip title="Edit">
        <a onClick={showModal}>
          <EditOutlined style={{ color: "#1890ff" }} />
        </a>
      </Tooltip>

      <Modal
        width={1100}
        getContainer={false}
        visible={isModalOpen}
        title="Edit Film"
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
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          form={form}
          layout="horizontal"
          name="form_in_modal"
          initialValues={{}}
        >
          <Row>
            <Col lg={12} xs={24}>
              <Form.Item name="id" label="Category Id">
                <Input disabled={true} defaultValue={id} />
              </Form.Item>
              <Form.Item
                onChange={(event) => {
                  setFormData({ ...formData, name: event.target.value });
                  console.log(formData);
                }}
                name="name"
                label="Film Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the Film name!",
                  },
                  { max: 50, message: 'Film Name must be max 50 characters.' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[
                  {
                    required: true,
                    message: "Please select a Category",
                  },
                ]}
              >
                <Select
                  onChange={(value) => {
                    setFormData({ ...formData, categoryId: value });
                    console.log(formData);
                  }}
                  placeholder="Select a Category"
                  allowClear
                >
                  {listCategory?.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                onChange={(event) => {
                  setFormData({ ...formData, producer: event.target.value });
                  console.log(formData);
                }}
                name="producer"
                label="Producer"
                rules={[
                  {
                    required: true,
                    // pattern: new RegExp(/\d+/g),
                    message: "Please input the Producer!",
                  },
                  { max: 50, message: 'Producer must be max 50 characters.' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                onChange={(event) => {
                  setFormData({ ...formData, director: event.target.value });
                  console.log(formData);
                }}
                name="director"
                label="Director"
                rules={[
                  {
                    required: true,
                    // pattern: new RegExp(/\d+/g),
                    message: "Please input the Director!",
                  },
                  { max: 50, message: 'Director must be max 50 characters.' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    duration: event.target.value,
                  });
                  console.log(formData);
                }}
                name="duration"
                label="Duration"
                rules={[
                  {
                    required: true,
                    // pattern: new RegExp(/\d+/g),
                    message: "Please input the Duration!",
                  },
                  {
                    pattern: new RegExp(/^[1-9]\d*$/),
                    message:
                      "Please input a valid positive interger number and duration must greater than 0!",
                  },
                  { max: 50, message: 'Duration must be max 50 characters.' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                onChange={(event) => {
                  setFormData({ ...formData, country: event.target.value });
                  console.log(formData);
                }}
                name="country"
                label="Country"
                rules={[
                  {
                    required: true,
                    // pattern: new RegExp(/\d+/g),
                    message: "Please input the Country!",
                  },
                  { max: 50, message: 'Country must be max 50 characters.' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label="Release Date: "
                name="release"
                rules={
                  [
                    // {
                    //   required: true,
                    //   message: "Please select a date!",
                    // },
                  ]
                }
              >
                <DatePicker
                  defaultValue={dayjs(release, dateFormat)}
                  onChange={onSelectDate}
                />
              </Form.Item>
              <Form.Item
                onChange={(event) => {
                  setFormData({ ...formData, description: event.target.value });
                  console.log(formData);
                }}
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Missing area",
                  },
                  { max: 1000, message: 'Description must be max 1000 characters.' },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                onChange={(event) => {
                  setFormData({ ...formData, videoLink: event.target.value });
                  console.log(formData);
                }}
                name="videoLink"
                label="Trailer (Youtube): "
                rules={[
                  {
                    required: true,

                    message: "Please input the Video Link!",
                  },
                  { max: 50, message: 'Video link must be max 50 characters.' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="image"
                label="Image: "
                rules={
                  [
                    // {
                    //   required: true,
                    //   // pattern: new RegExp(/\d+/g),
                    //   message: "Please select an image!",
                    // },
                  ]
                }
              >
                <Test fetchImgLink={fetchImgLink} imgPath={image} />
              </Form.Item>
            </Col>
          </Row>
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

export default FilmUpdate;
