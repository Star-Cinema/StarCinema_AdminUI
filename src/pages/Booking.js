// /*!
// =========================================================
// * Muse Ant Design Dashboard - v1.0.0
// =========================================================
// * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
// * Copyright 2021 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
// * Coded by Creative Tim
// =========================================================
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */
import {
    Row,
    Col,
    Card,
    Table,
    Button,
    Typography,
    Modal,
    Form,
    Select
} from "antd";

import { DeleteOutlined, InfoOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import axios from "axios";

const Option = Select.Option;
const { Text } = Typography;

//styles
const HeaderTableStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #f0f0f0",
    borderRadius: "2px 2px 0 0",
}

// table code start
const columns = [
    {
        key: "ID",
        title: "ID",
        dataIndex: "ID",
    },
    {
        key: "userName",
        dataIndex: "userName",
        title: "Tên khách hàng",
    },
    {
        key: "film",
        dataIndex: "film",
        title: "Phim",
    },
    {
        key: "totalPrice",
        dataIndex: "totalPrice",
        title: "Tổng tiền",
    },
    {
        key: "createAt",
        dataIndex: "createAt",
        title: "Thời gian booking",
    },
    {
        key: "actions",
        dataIndex: "actions",
        title: "Actions",
    },
];

export default function Booking() {

    const [form] = Form.useForm();

    const [bookings, setBookings] = useState([]);
    const [booking, setBooking] = useState({});
    const [films, setFilms] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [services, setServices] = useState([]);
    const [seats, setSeats] = useState([]);

    const [loading, setLoading] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);

    const [isShowInfo, setIsShowInfo] = useState(false);
    const [isShowCreate, setIsShowCreate] = useState(false);

    const [formData, setFormData] = useState({
        filmId: '',
        scheduleId: '',
        listServiceId: [],
        listSeatId: [],
    });

    useEffect(() => {
        setPage(1);
    }, [pageSize])

    useEffect(() => {
        getRecords(page, pageSize);
    }, [page, pageSize])

    // Convert to format date
    function convertDateTime(dateTimeStr) {
        const dateTime = new Date(dateTimeStr);
        const date = dateTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
        const time = dateTime.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
        return `${date} ${time}`;
    }

    // handle delete and cofirm booking 
    const onDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                await axios.delete(`https://localhost:7113/api/Bookings?id=${id}`);
                getRecords(page, pageSize);
            }
        });
    }

    // Get all record booking 
    const getRecords = (page, pageSize) => {
        setLoading(true);
        axios.get(`https://localhost:7113/api/Bookings/GetAllByPage?page=${page - 1}&limit=${pageSize}`)
            .then((res) => {
                const data = [];
                if (res.data != null) {
                    res.data.data.listItem.map((item, index) => {
                        data.push({
                            key: item.id,
                            ID: (
                                <>{item.id}</>
                            ),
                            userName: (
                                <>{item.userName}</>
                            ),
                            film: (
                                <>{item.filmName}</>
                            ),
                            totalPrice: (
                                <>{item.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</>
                            ),
                            createAt: (
                                <>{convertDateTime(item.createAt)}</>
                            ),
                            actions: (
                                <>
                                    <InfoOutlined onClick={async () => await handleShowInfo(item.id)} style={{ fontSize: 18, cursor: "pointer", marginRight: 10 }} ></InfoOutlined>
                                    {/* <EditTwoTone onClick={async () => await handleShowFormCreate()} style={{ fontSize: 18, cursor: "pointer" }}></EditTwoTone> */}
                                    <DeleteOutlined onClick={() => onDelete(item.id)} style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}></DeleteOutlined>
                                </>
                            )
                        })
                    })
                }
                setBookings(data);
                setTotalItem(res.data.data.totalCount);
                setLoading(false);
            })
    }

    // Get Schedule by FilmId
    useEffect(() => {
        if(!formData.filmId) 
        axios.get(`https://localhost:7113/api/Schedules?filmId=${formData.filmId}`)
            .then((response) => {
                setSchedules(response.data.data.listItem);
            });
    }, [formData.filmId])

    // Get Seat Not booked by filmId and scheduleId
    useEffect(() => {
        axios.get(`https://localhost:7113/api/Bookings/GetSeatsNotBooked?filmId=${formData.filmId}&scheduleId=${formData.scheduleId}`)
            .then((response) => {
                setSeats(response.data.data);
            });
    }, [formData.scheduleId])

    // handle show modal detail booking
    const handleShowInfo = async (id) => {
        await axios.get(`https://localhost:7113/api/Bookings/${id}`)
            .then((response) => {
                setBooking(response.data.data);
            });
        setIsShowInfo(true);
    }

    // handle show modal form create booking
    const handleShowFormCreate = async () => {
        await axios.get("https://localhost:7113/api/Bookings/GetAllFilms",)
            .then((response) => {
                setFilms(response.data.data);
            });
        await axios.get(`https://localhost:7113/Service`)
            .then((response) => {
                setServices(response.data.data);
            });
        await setIsShowCreate(true);
    }

    const handleOnChange = async (value, name) => {
        console.log(name + ' ' + value);
        setFormData({ 
            ...formData, 
            [name]: value
        });
    }

    // handle Ok when submit create
    const handleOk = async () => {
        const values = form.getFieldsValue();
        let _formData = {
            filmId: values.filmId,
            scheduleId: values.scheduleId,
            listServiceId: values.listServiceId,
            listSeatId: values.listSeatId,
        }
        await axios.post(`https://localhost:7113/api/Bookings`, _formData)
        .then((response) => {
            console.log('response: ', response);
        });
        getRecords(page, pageSize);
        setIsShowCreate(false);
    }

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card bordered={false} className="criclebox tablespace mb-24" >
                            <div style={HeaderTableStyles}>
                                <span style={{ fontSize: 20, fontWeight: 600 }}>List Bookings</span>
                                <Button onClick={async () => await handleShowFormCreate()} style={{ background: "#237804", color: "#ffffff" }}>
                                    <i className="fa-solid fa-plus" style={{ marginRight: 6 }}></i>
                                    Add
                                </Button>
                            </div>
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={bookings}
                                    loading={loading}
                                    pagination={{
                                        position: ["bottomCenter"],
                                        current: page,
                                        pageSize: pageSize,
                                        total: totalItem,
                                        showSizeChanger: true,
                                        pageSizeOptions: ['10', '30', '50'],
                                        onChange: (page, pageSize) => {
                                            setPage(page);
                                            setPageSize(pageSize);
                                        }
                                    }}
                                    className="ant-border-space"
                                />

                                <Modal title='Create Booking' visible={isShowCreate} 
                                    onOk={() => {form.validateFields().then(handleOk)} } 
                                    onCancel={() => {
                                        setIsShowCreate(false);
                                        form.resetFields();
                                }}>
                                    <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} layout="horizontal" style={{ alignContent: "center" }} >
                                        <Form.Item name="filmId" label="Film"
                                            rules={[
                                                { required: true, message: "Select the film" },
                                                {
                                                    validator: (rule, value, callback) => {
                                                        if (value === "Select") {
                                                            callback("Select the film");
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ]}
                                        >
                                            <Select name="filmId"
                                                placeholder="Select a film"
                                                allowClear
                                                onChange={(value)=>handleOnChange(value, 'filmId')}
                                            >
                                                {films?.map(item => (
                                                    <Option value={item.id} key={item.id} name='filmId'>
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        { formData.filmId && <Form.Item name="scheduleId" label="Schedule"
                                            rules={[
                                                { required: true, message: "Select the schedule" },
                                                {
                                                    validator: (rule, value, callback) => {
                                                        if (value === "Select") {
                                                            callback("Select the schedule");
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ]}
                                        >
                                            <Select name="scheduleId"
                                                placeholder="Select a schedule"
                                                allowClear
                                                onChange={(value)=>handleOnChange(value, 'scheduleId')}
                                            >
                                                {schedules?.map(item => (
                                                    <Option value={item.id} key={item.id} name='scheduleId'>
                                                        {item.startTime}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item> }

                                        <Form.Item name="listSeatId" label="Seat"
                                            rules={[
                                                { required: true, message: "Select the Seat" },
                                                {
                                                    validator: (rule, value, callback) => {
                                                        if (value === "Select") {
                                                            callback("Select the Seat");
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ]}
                                        >
                                            <Select
                                                name="listSeatId"
                                                mode="multiple"
                                                placeholder="Select a Seat"
                                                allowClear
                                                style={{
                                                    width: '100%',
                                                }}
                                            >
                                                {seats?.map(item => (
                                                    <Option value={item.id} key={item.id} name='listSeatId'>
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item name="listServiceId" label="Service"
                                            rules={[
                                                {
                                                    validator: (rule, value, callback) => {
                                                        if (value === "Select") {
                                                            callback("Select the Service");
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ]}
                                        >
                                            <Select
                                                name="listServiceId"
                                                mode="multiple"
                                                placeholder="Select a service"
                                                allowClear
                                                style={{
                                                    width: '100%',
                                                }}
                                            >
                                                {services?.map(item => (
                                                    <Option value={item.id} key={item.id} name='listServiceId'>
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Form>
                                </Modal>

                                <Modal
                                    title='Details Booking'
                                    visible={isShowInfo}
                                    onOk={() => { setIsShowInfo(false) }}
                                    onCancel={() => { setIsShowInfo(false) }}
                                >
                                    <Form
                                        form={form}
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                        layout="horizontal"
                                        style={{ alignContent: "center" }}
                                    >
                                        <Form.Item name="id" label="Mã booking" >
                                            <Text type="success"> {booking.id} </Text>
                                        </Form.Item>
                                        <Form.Item name="userName" label="Họ và tên" >
                                            <Text type="success"> {booking.userName} </Text>
                                        </Form.Item>
                                        <Form.Item name="filmName" label="tên phim" >
                                            <Text type="success"> {booking.filmName} </Text>
                                        </Form.Item>
                                        <Form.Item name="createAt" label="Ngày booking" >
                                            <Text type="success"> {convertDateTime(booking.createAt)} </Text>
                                        </Form.Item>
                                        <hr></hr>
                                        <Form.Item name="totalPrice" label="Tổng tiền" >
                                            <Text type="success"> {booking.totalPrice} </Text>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>

                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}




