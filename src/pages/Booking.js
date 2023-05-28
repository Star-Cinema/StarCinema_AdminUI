////////////////////////////////////////////////////////////////////////////////////////////////////////
//FileName: Booking.js
//FileType: Javascript Source file
//Author : TuNT37
//Created On : 19/05/2023
//Last Modified On : 24/05/2023
//Copy Rights : FA Academy
//Description : 
////////////////////////////////////////////////////////////////////////////////////////////////////////

import {
    Row,
    Col,
    Card,
    Table,
    Button,
    Typography,
    Modal,
    Form,
    Select,
    Space
} from "antd";

import { DeleteOutlined, InfoOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

const Option = Select.Option;
const { Text } = Typography;
const token = sessionStorage.getItem("token")

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
        title: "UserName",
    },
    {
        key: "film",
        dataIndex: "film",
        title: "Film",
    },
    {
        key: "status",
        dataIndex: "status",
        title: "Stutus",
    },
    {
        key: "totalPrice",
        dataIndex: "totalPrice",
        title: "TotalPrice",
    },
    {
        key: "createAt",
        dataIndex: "createAt",
        title: "DateCreate",
    },
    {
        key: "actions",
        dataIndex: "actions",
        title: "Actions",
    },
];

// TuNT37 : function booking
export default function Booking() {

    const [form] = Form.useForm();
    const defaultCurrentPage = 5;  // Default current page size

    const [bookings, setBookings] = useState([]);   // TuNT37 bookings 
    const [booking, setBooking] = useState({});     // TuNT37 booking
    const [films, setFilms] = useState([]);         // TuNT37 flims
    const [schedules, setSchedules] = useState([]); // TuNT37 schedules
    const [services, setServices] = useState([]);   // TuNT37 services
    const [seats, setSeats] = useState([]);         // TuNT37 seats

    const [loading, setLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(0);  // TuNT37 totalPage
    const [pageSize, setPageSize] = useState(10);   // TuNT37 pageSize
    const [page, setPage] = useState(1);            // TuNT37 page
    const [keySearch, setKeySearch] = useState(''); // TuNT37 keyword search 

    const [isShowInfo, setIsShowInfo] = useState(false);      // TuNT37 set show info booking detail
    const [isShowCreate, setIsShowCreate] = useState(false);  // TuNT37 set show form create 

    // TuNT37 form data
    const [formData, setFormData] = useState({
        filmId: '',
        scheduleId: '',
        listServiceId: [],
        listSeatId: [],
    });

    // TuNT37 set page 
    useEffect(() => {
        setPage(1);
    }, [pageSize])

    // TuNT37 Call api and reRender record when change page/pageSize
    useEffect(() => {
        getRecords(page, pageSize, keySearch);
    }, [page, pageSize])

    // TuNT37 Convert to format date
    function convertDateTime(dateTimeStr) {
        const dateTime = new Date(dateTimeStr);
        const date = dateTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
        const time = dateTime.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
        return `${date} ${time}`;
    }

    // TuNT37 handle delete and cofirm booking 
    const onDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                await axios.delete(`https://localhost:7113/api/Bookings?id=${id}`);
                getRecords(page, pageSize, keySearch);
            }
        });
    }

    // TuNT37 Get all record booking 
    const getRecords = (page, pageSize, keySearch) => {
        setLoading(true);
        axios.get(`https://localhost:7113/api/Bookings/GetAllByPage?keySearch=${keySearch}&page=${page - 1}&pageSize=${pageSize}`)
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
                            status: (
                                <>{item.status}</>
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
                setTotalPage(res.data.data.totalCount);
                setLoading(false);
            })
    }

    // TuNT37 Get Schedule by FilmId
    useEffect(() => {
        if (!formData.filmId)
            axios.get(`https://localhost:7113/api/Schedules?filmId=${formData.filmId}`)
                .then((response) => {
                    setSchedules(response.data.data.listItem);
                });
    }, [formData.filmId])

    // TuNT37 Get Seat Not booked by filmId and scheduleId
    useEffect(() => {
        axios.get(`https://localhost:7113/api/Bookings/GetSeatsNotBooked?filmId=${formData.filmId}&scheduleId=${formData.scheduleId}`)
            .then((response) => {
                setSeats(response.data.data);
            });
    }, [formData.scheduleId])

    // TuNT37 handle show modal detail booking
    const handleShowInfo = async (id) => {
        await axios.get(`https://localhost:7113/api/Bookings/${id}`)
            .then((response) => {
                setBooking(response.data.data);
            });
        setIsShowInfo(true);
    }

    // TuNT37 handle show modal form create booking
    const handleShowFormCreate = async () => {
        await axios.get("https://localhost:7113/api/Bookings/GetAllFilms",)
            .then((response) => {
                setFilms(response.data.data);
            });
        await axios.get(`https://localhost:7113/api/Service/GetAllServices?page=0&pageSize=1000`)
            .then((response) => {
                setServices(response.data.data.listItem);
            });
        await setIsShowCreate(true);
    }

    // TuNT37 handle on change 
    const handleOnChange = async (value, name) => {
        console.log(name + ' ' + value);
        setFormData({
            ...formData,
            [name]: value
        });
    }

    // TuNT37 handle Ok when submit create
    const handleOk = async () => {
        const values = form.getFieldsValue();
        let _formData = {
            filmId: values.filmId,
            scheduleId: values.scheduleId,
            listServiceId: values.listServiceId,
            listSeatId: values.listSeatId,
        }
        await axios.post(`https://localhost:7113/api/Bookings/CreateBookingByAdmin`, _formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })  // TuNT37 call api create booking 
            .then((response) => {
                console.log('response: ', response);
            });
        getRecords(page, pageSize, keySearch);
        form.resetFields();
        setFormData({ ...formData, filmId: null })
        setIsShowCreate(false);
    }

    //Request API to search Booking
    const handleSearch = () => {
        getRecords(page, pageSize, keySearch)
    }

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card bordered={false} className="criclebox tablespace mb-24" >
                            <div style={HeaderTableStyles}>
                                <span style={{ fontSize: 20, fontWeight: 600 }}>List Bookings</span>

                                {/* TuNT37 button add */}
                                <Space direction="horizontal">
                                    <div className="search-container">
                                        <div className="search-input-container">
                                            <input type="text" className="search-input" placeholder="Search" onChange={(e) => setKeySearch(e.target.value)}/>
                                        </div>
                                        <div className="search-button-container">
                                            <button className="search-button" onClick={handleSearch}>
                                                <i className="fas fa-search" />
                                            </button>
                                        </div>
                                    </div>
                                    <Button onClick={async () => await handleShowFormCreate()} style={{ background: "#237804", color: "#ffffff" }}>
                                        <i className="fa-solid fa-plus" style={{ marginRight: 6 }}></i>
                                        Add
                                    </Button>
                                </Space>
                            </div>
                            <div className="table-responsive">

                                {/* TuNT37 table data booking */}
                                <Table
                                    columns={columns}
                                    dataSource={bookings}
                                    loading={loading}
                                    pagination={{
                                        defaultCurrent: defaultCurrentPage,
                                        position: ["bottomCenter"],
                                        current: page,
                                        pageSize: pageSize,
                                        total: totalPage,
                                        showSizeChanger: true,
                                        pageSizeOptions: ['2', '5', '10', '20'],
                                        onChange: (page, pageSize) => {
                                            setPage(page);
                                            setPageSize(pageSize);
                                        }
                                    }}
                                    className="ant-border-space"
                                />

                                {/* TuNT37  Modal create booking */}
                                <Modal title='Create Booking' visible={isShowCreate}
                                    onOk={() => { form.validateFields().then(handleOk) }}
                                    onCancel={() => {
                                        setIsShowCreate(false);
                                        setFormData({ ...formData, filmId: null });
                                        form.resetFields();
                                    }}>
                                    <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} layout="horizontal" style={{ alignContent: "center" }} >

                                        {/* TuNT37 Select Flim */}
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
                                                onChange={(value) => handleOnChange(value, 'filmId')}
                                            >
                                                {films?.map(item => (
                                                    <Option value={item.id} key={item.id} name='filmId'>
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        {/* TuNT37 if selected filmId then show schedule by filmId  */}
                                        {formData.filmId && <Form.Item name="scheduleId" label="Schedule"
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
                                                onChange={(value) => handleOnChange(value, 'scheduleId')}
                                            >
                                                {schedules?.map(item => (
                                                    <Option value={item.id} key={item.id} name='scheduleId'>
                                                        {item.startTime}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>}

                                        {/* TuNT37 Select Seat */}
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

                                        {/* TuNT37 Select Service */}
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

                                {/* TuNT37 Modal show detail booking */}
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
                                        <Form.Item name="id" label="Id" >
                                            <Text type="success"> {booking.id} </Text>
                                        </Form.Item>
                                        <Form.Item name="userName" label="userName" >
                                            <Text type="success"> {booking.userName} </Text>
                                        </Form.Item>
                                        <Form.Item name="filmName" label="FilmName" >
                                            <Text type="success"> {booking.filmName} </Text>
                                        </Form.Item>
                                        <Form.Item name="status" label="Status" >
                                            <Text type="success"> {booking.status} </Text>
                                        </Form.Item>
                                        <Form.Item name="createAt" label="DateCreate" >
                                            <Text type="success"> {convertDateTime(booking.createAt)} </Text>
                                        </Form.Item>
                                        <hr></hr>
                                        <Form.Item name="totalPrice" label="TotalPrice" >
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




