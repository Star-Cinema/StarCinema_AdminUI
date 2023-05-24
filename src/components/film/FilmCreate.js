import { React, useState, useEffect } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";

import {
  Tooltip,
  Modal,
  Button,
  Form,
  Input,
  notification,
  Select,
  DatePicker,
  Row,
  Col,
} from "antd";

import ImageUpload from "./ImageUpload";

const { Option } = Select;
const { TextArea } = Input;

const FilmCreate = ({ loadData }) => {
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

  //STARTREGION
  // VyVNK1 for upload image

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
    console.log(value);
  };
  //ENDREGION

  //STARTREGION
  //VYVNK1 get all category

  const [listCategory, setListCategory] = useState([]);

  const [isBusy, setBusy] = useState(true);

  const loadCategory = () => {
    setBusy(true);
    async function fetchData() {
      axios
        .get("https://localhost:7113/api/Categories?page=0&limit=10")
        .then((response) => {
          setBusy(false);
          setListCategory(response.data.data.listItem);
        });
    }

    fetchData();
  };

  useEffect(() => {
    loadCategory();
  }, []);

  //END REGION

  const [formData, setFormData] = useState({
    name: "",
  });
  const [beError, setBeError] = useState("");
  const [displayErr, setdisplayErr] = useState(false);

  // const handleChange = async (value, name) => {
  //   console.log(name + " " + value);
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });

  //   console.log(formData);
  // };

  // GET DATE FROM DATEPICKER
  const onSelectDate = (date, dateString) => {
    console.log(date, dateString);
    setFormData({
      ...formData,
      release: date.format("YYYY-MM-DD"),
    });
  };

  //START REGION
  //VYVNK1 FUNCTION CREATE FILM
  const handleCreate = () => {
    console.log(formData.image[0].path);
    axios
      .post(`https://localhost:7113/api/Films`, formData)
      .then(function (response) {
        setIsModalOpen(false);
        loadData();
        notification.open({
          message: "Notification",
          description: "Add Film successfully!",
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
  //END REGION

  //START REGION
  //VYVNK1 UI OF CREATE FILM
  return (
    <>
      {isBusy ? (
        <></>
      ) : (
        <>
          <Tooltip title="Create Film">
            <Button
              style={{ marginBottom: "1em", background: "transparent" }}
              type="primary"
              onClick={showModal}
            >
              <PlusCircleOutlined
                style={{ fontSize: "150%", color: "#1890ff" }}
              />
            </Button>
          </Tooltip>

          <Modal
            visible={isModalOpen}
            title="Create a new Film"
            okText="Create"
            cancelText="Back"
            onCancel={handleCancel}
            width={1000}
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
              // layout="horizontal"
              name="form_in_modal"
              initialValues={{
                modifier: "public",
              }}
            >
              <Row>
                <Col lg={12} xs={24}>
                  <Form.Item
                    // onChange={(e) => handleChange(e)}

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
                      setFormData({
                        ...formData,
                        producer: event.target.value,
                      });
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
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        director: event.target.value,
                      });
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
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                  <Form.Item
                    label="Release Date: "
                    name="release"
                    rules={[
                      {
                        required: true,
                        message: "Please select a date!",
                      },
                    ]}
                  >
                    <DatePicker onChange={onSelectDate} />
                  </Form.Item>
                  <Form.Item
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        description: event.target.value,
                        image: [
                          {
                            name: "string",
                            path: "string",
                          },
                        ],
                      });
                      console.log(formData);
                    }}
                    name="description"
                    label="Description"
                    rules={[
                      {
                        required: true,
                        message: "Missing area",
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        videoLink: event.target.value,
                      });
                      console.log(formData);
                    }}
                    name="videoLink"
                    label="Video Link:"
                    rules={[
                      {
                        required: true,

                        message: "Please input the Video Link!",
                      },
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
                    <ImageUpload fetchImgLink={fetchImgLink} />
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
      )}
    </>
  );
};
// END REGION
export default FilmCreate;
