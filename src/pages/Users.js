import {
    Row,
    Col,
    Card,
    Radio,
    Table,
    Upload,
    message,
    Progress,
    Button,
    Avatar,
    Typography,
    Popconfirm,
    Modal,
    Form,
    DatePicker,
    Checkbox,
    Input,
    Select,
    InputNumber,
    Pagination,
    Space,
} from "antd";

import { DeleteOutlined, EditTwoTone, PlusOutlined, SearchOutlined, ToTopOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";
import TextArea from "antd/lib/input/TextArea";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// import Search from "antd/lib/transfer/search";
import Search from "antd/lib/input/Search";
import { UploadImageAPI } from "../assets/js/public";
import moment from "moment";
import dayjs from 'dayjs';

const { Title } = Typography;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
// table code start
const columns = [
    {
        title: "NAME",
        dataIndex: "name",
        key: "name",
        width: "32%",
    },
    {
        title: "ROLE",
        dataIndex: "role",
        key: "role",
    },

    {
        title: "STATUS",
        key: "status",
        dataIndex: "status",
    },
    {
        title: "DOB",
        key: "created",
        dataIndex: "created",
    },
    {
        title: "FUNCTION",
        key: "function",
        dataIndex: "function",
    },
];

//Show list user in database HungTD34
function User() {
    const history = useHistory()
    const [page, setPage] = useState(1)
    const [key, setKey] = useState('')
    const [loading, setLoading] = useState(true)
    const [users, setUser] = useState()
    const [form] = Form.useForm()
    const [formData, setFormData] = useState({
        avatar: ""
    })
    const [url, setUrl] = useState()

    useEffect(() => {
        fecthData(page, 10, key)
    }, [page])

    //Get data when page load HungTD34
    const fecthData = async (page = 1, pageSize = 10, key = "", sortBy = "id") => {
        setLoading(true)
        var res = await axios.get(
            "https://localhost:7113/api/users?page=" + page + "&pageSize=" + pageSize + "&key=" + key + "&sortBy=" + sortBy,
            {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                }
            }
        )
        const data = []

        //Convert records to rows for display HungTD34
        res.data.data.map((item, index) => (
            data.push({
                key: index,
                name: (
                    <>
                        <Avatar.Group>
                            <Avatar
                                className="shape-avatar"
                                shape="square"
                                size={40}
                                src={item?.avatar}
                            ></Avatar>
                            <div className="avatar-info">
                                <Title level={5}>{item?.name}</Title>
                                <p>{item?.email}</p>
                            </div>
                        </Avatar.Group>{" "}
                    </>
                ),
                role: (
                    <>
                        <div className="author-info">
                            <Title level={5}>{item?.roleDTO.name}</Title>
                            {/* <p>Developer</p> */}
                        </div>
                    </>
                ),

                status: (
                    <>
                        {
                            item?.isDelete ?
                                <Button type="danger" className="tag-primary">
                                    DENINE
                                </Button>
                                :
                                <Button type="primary" className="tag-primary">
                                    ACTIVE
                                </Button>
                        }
                        {/* <Button className="tag-badge">{item?.isDelete ? "DENINE" : "ACTIVE"}</Button> */}
                    </>
                ),
                created: (
                    <>
                        <div className="ant-employed">
                            <span>{item?.dob?.slice(0, 10)}</span>
                        </div>
                    </>
                ),
                function: (
                    <>
                        <EditTwoTone
                            style={{ fontSize: 18, color: "blue", marginLeft: 12, cursor: "pointer" }}
                            onClick={() => history.push("users/" + item?.id)}
                        />
                        <Popconfirm title="Are you sure to delete this service"
                            onConfirm={() => handleDeleteUser(item?.id)}>
                            <DeleteOutlined
                                style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </>
                )
            })
        ))

        setUser(data)
        setLoading(false)
    }

    //Request API to disable user HungTD34
    const handleDeleteUser = async (id) => {
        var res = await axios.delete("https://localhost:7113/api/users/" + id,
            {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                }
            })
        console.log(res.data)
        if (res?.data?.code == 200) window.location.reload()
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    //Show form create new user HungTD34
    const showModal = () => {
        setIsModalOpen(true);
    };

    //Request API to create new user when form submit HungTD34
    const handleOk = async () => {
        var data = form.getFieldValue()

        data.avatar = url
        data.dob = data.dob.toISOString()

        var res = await axios.post("https://localhost:7113/api/users/create", data,
            {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                }
            })
        console.log(res)
        setIsModalOpen(false);

        window.location.reload()
    };

    //Close form create HungTD34
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // const handleChange = (e) => {
    //     if (e.target)
    //         setFormData({ ...formData, [e.target.name]: e.target.value });
    //     else setFormData({ ...formData, ["roleId"]: e })
    // };


    //Set state of dob HungTD34
    const handleChangeDob = (e) => {
        setFormData({ ...formData, ['dob']: e });
    }

    //Request API to search user by name HungTD34
    const handleSearch = () => {
        fecthData(page, 10, key)
    }


    //Upload avatar user to cloudinary HungTD34
    const handleUpload = async (file) => {
        var res = await UploadImageAPI(file.file)
        setUrl(res)

        return true
    }

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Users Table"
                            extra={
                                <>
                                    <Space direction="horizontal">
                                        <div className="search-container">
                                            <div className="search-input-container">
                                                <input type="text" className="search-input" placeholder="Search" onChange={(e) => setKey(e.target.value)} />
                                            </div>
                                            <div className="search-button-container">
                                                <button className="search-button" onClick={handleSearch}>
                                                    <i className="fas fa-search" />
                                                </button>
                                            </div>
                                        </div>
                                        <Button type="primary" onClick={showModal}>
                                            <UserAddOutlined style={{ fontSize: 18 }} />
                                            Add
                                        </Button>
                                    </Space>
                                </>
                            }
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={users}
                                    pagination={false}
                                    className="ant-border-space"
                                    loading={loading}
                                />
                            </div>
                        </Card>
                        <Pagination defaultCurrent={1} total={15} onChange={(page) => setPage(page)} style={{ textAlign: "center" }} />
                    </Col>
                </Row>

                <Modal title="Form create user" open={isModalOpen}
                    onOk={() => {
                        form.validateFields().then(() => {
                            handleOk()
                        });
                    }}
                    onCancel={handleCancel} visible={isModalOpen}>
                    <Form
                        form={form}
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        layout="vertical"
                    // disabled={componentDisabled}
                    // style={{
                    //     maxWidth: 600,
                    // }}
                    >
                        <Form.Item name="name" label="Name"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    type: 'string',
                                    min: 6,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="Email"
                            rules={[{ required: true },
                            {
                                type: 'email',
                            },
                            {
                                pattern: /^[a-zA-Z0-9.]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                message: 'Email format wrong',
                            }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item label="Phone" name="phone"
                            rules={[{ required: true },
                            {
                                type: 'string',
                                len: 10
                            }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item label="Password" name="password"
                            rules={[{ required: true },
                            { type: 'string', min: 6 }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item style={{ display: "flex" }}>
                            <Form.Item label="Dob" name="dob"
                                rules={[
                                    {
                                        required: true,
                                    }]
                                }
                            >
                                <DatePicker style={{ width: "100%" }} onChange={(e) => handleChangeDob(e.toISOString())}
                                    disabledDate={(current) => current.isBefore(moment().subtract(100, "year"))
                                        || current.isAfter(moment().subtract(15, "year"))
                                    }
                                // disabledDate={(current) => current.isAfter(dayjs(new Date().setFullYear(new Date().getFullYear() - 1)))
                                // || current.isAfter(dayjs(new Date().setFullYear(new Date().getFullYear() - 15)))
                                //}
                                />

                            </Form.Item>

                            <Form.Item label="Role" name="role"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Select.Option value="1">Admin</Select.Option>
                                    <Select.Option value="2">User</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="Gender" name="gender"
                            rules={[{ required: true }]}
                        >
                            <Radio.Group>
                                <Radio value={true}> Male </Radio>
                                <Radio value={false}> FeMale </Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Avatar" name="avatar" valuePropName="fileList" getValueFromEvent={normFile}>
                            <Upload listType="picture-card"
                                customRequest={handleUpload}
                            // beforeUpload={() => false}
                            >
                                <div>
                                    <PlusOutlined />
                                    <div
                                        style={{
                                            marginTop: 8,
                                        }}
                                    >
                                        Select
                                    </div>
                                </div>
                            </Upload>
                        </Form.Item>
                        {/* <Form.Item label="Button">
                            <Button>Button</Button>
                        </Form.Item> */}
                    </Form>
                </Modal>
            </div>
        </>
    );
}

export default User;
