/*
    Account : AnhNT282
    Description : UI schedule manager
    Date created : 2023/05/11
*/

import {
    Row,
    Col,
    Card,
    Table,
    Button,
    Modal,
    Input,
    Form,
    DatePicker,
    Select,
    Space,
    message,
    notification,
    InputNumber
} from "antd";

import '../assets/styles/schedulePage.css';
import { DeleteOutlined, EditTwoTone, } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import dayjs from 'dayjs';
import CalendarTest from '../components/calendar/CalendarTest';

const Option = Select.Option;

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
        key: "filmName",
        dataIndex: "filmName",
        title: "Film",
    },
    {
        key: "roomName",
        dataIndex: "roomName",
        title: "Room",
    },
    {
        key: "price",
        dataIndex: "price",
        title: "Price",
    },
    {
        key: "startTime",
        dataIndex: "startTime",
        title: "Start time",
    },
    {
        key: "endTime",
        dataIndex: "endTime",
        title: "End time",
    },
    {
        key: "actions",
        dataIndex: "actions",
        title: "Actions",
    },
];
// Convert datetime Local to format YYYY-MM-DD HH:MM AnhNT282
function convertDateTime(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    const date = dateTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const time = dateTime.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
    return `${date} ${time}`;
}


function SchedulesTable() {
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [isShowForm, setIsShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [dataFilm, setDataFilm] = useState([])
    const [dataRoom, setDataRoom] = useState([])
    const [selectedFilm, setSelectedFilm] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedDate, setSelectedDate] = useState();
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolder1] = notification.useNotification();
    const [schedulesOfRoomSelected, setSchedulesOfRoomSelected] = useState([]);


    const handleFilmChange = (value) => {
        setSelectedFilm(value);
    };

    const handleRoomChange = (value) => {
        setSelectedRoom(value);
    };
    // Convert local time to format YYYY-MM-DD AnhNT282
    const handleSelectDateTime = (date, dateString) => {
        const parts = dateString.split('/');
        const convertedDate = parts.reverse().join('-');
        setSelectedDate(convertedDate);
    }

    // get list room, list film AnhNT282
    useEffect(() => {
        (async () => {
            const dataFilmAPI = await axios.get(`https://localhost:7113/api/Films?page=0&pageSize=10000`);
            const dataRoomAPI = await axios.get(`https://localhost:7113/api/Room?PageIndex=0&PageSize=100&SortColumn=Name&SortOrder=ASC`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            });
            setDataFilm(dataFilmAPI.data.data.listItem)
            setDataRoom(dataRoomAPI.data.data)
        })()
    }, [])


    useEffect(() => {
        setPage(1);
        getRecords();
    }, [pageSize, selectedFilm, selectedRoom, selectedDate])

    useEffect(() => {
        getRecords();
    }, [page])

    const getSchedulesOfRoom = () => {
        if(selectedRoom) {
            axios.get(`https://localhost:7113/api/Schedules?roomId=${selectedRoom}`).then(res => {
                var listSchedule = [];
                res.data.data.listItem.map(item => {
                    listSchedule.push({title: item.film.name, start: item.startTime, end: item.endTime});
                })
                setSchedulesOfRoomSelected(listSchedule);
            }).catch(e => console.log(e))
    }



    // handle delete scheduled AnhNT282
    const onDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                axios.delete(`https://localhost:7113/api/Schedules/${id}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                            "Content-Type": "application/json",
                        }
                    }).then((response) => {
                        messageApi.open({
                            type: 'success',
                            content: response.data?.message,
                        });
                        getRecords();
                        getSchedulesOfRoom();
                    }).catch((error) => {
                        api['error']({
                            message: 'Error',
                            description: error.response?.data?.message
                        });
                    });
            }
        });
    }
    // handle add schedule AnhNT282
    const onAdd = () => {
        setIsShowForm(false)
        setIsAdding(false);
        let startTime = new Date(form.getFieldValue('startTime'));
        startTime.setHours(startTime.getHours() + 7);
        console.log(startTime.toISOString());

        const formData = { ...form.getFieldsValue(), startTime: startTime };
        axios.post(`https://localhost:7113/api/Schedules`, formData,
            {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                messageApi.open({
                    type: 'success',
                    content: 'Successfully added'
                });
                getRecords();
                getSchedulesOfRoom();

            }).catch((error) => {
                api['error']({
                    message: 'Error',
                    description: error.response?.data?.message
                });
            });
    };
    // handle edit schedule AnhNT282
    const onEdit = () => {
        setIsShowForm(false)
        setIsEditing(false);
        const startTime = form.getFieldValue('startTime')?.toISOString();
        const formData = { ...form.getFieldsValue(), startTime: startTime };
        axios.put(`https://localhost:7113/api/Schedules/${formData.id}`, formData,
            {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            })
            .then((response) => {
                messageApi.open({
                    type: 'success',
                    content: 'Successfully edited'
                });
                getRecords();
                getSchedulesOfRoom();

            }).catch((error) => {
                api['error']({
                    message: 'Error',
                    description: error.response?.data?.message
                });
            });;
    };
    
    useEffect(() => {
        getSchedulesOfRoom();
    },[selectedRoom])

    // Get list of schedules AnhNT282
    const getRecords = () => {
        setLoading(true);
        let query = `https://localhost:7113/api/Schedules?page=${page - 1}&limit=${pageSize}`;
        selectedFilm && (query += `&filmId=${selectedFilm}`);
        selectedRoom && (query += `&roomId=${selectedRoom}`);
        selectedDate && (query += `&date=${selectedDate}`);
        axios.get(query)
            .then((res) => {
                const data = [];
                if (res.data != null) {
                    res.data.data.listItem.map((item, index) => {
                        data.push({
                            key: index,
                            ID: (
                                <>{item.id}</>
                            ),
                            filmName: (
                                <>{item.film.name}</>
                            ),
                            roomName: (
                                <>{item.room.name}</>
                            ),
                            price: (
                                <>{item?.ticket?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</>
                            ),
                            startTime: (
                                <>{convertDateTime(item.startTime)}</>
                            ),
                            endTime: (
                                <>{convertDateTime(item.endTime)}</>
                            ),
                            actions: (
                                <>
                                    <EditTwoTone
                                        onClick={() => {
                                            setIsEditing(true);
                                            setIsShowForm(true);
                                            form.setFieldsValue({
                                                id: item.id,
                                                filmId: item.filmId,
                                                roomId: item.roomId,
                                                startTime: moment(new Date(item.startTime), 'DD/MM/YYYY HH:mm'),
                                                price: Number(item.ticket.price)
                                            })
                                        }} style={{ fontSize: 18, cursor: "pointer" }}></EditTwoTone>
                                    <DeleteOutlined onClick={() => onDelete(item.id)} style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}></DeleteOutlined>
                                </>
                            )


                        })
                    })
                }
                setDataSource(data);
                setTotalItem(res.data.data.totalCount);
                setLoading(false);
            })
    }




    return (
        <>
            {contextHolder}
            {contextHolder1}
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                        >
                            <div style={HeaderTableStyles}>
                                <span style={{ fontSize: 20, fontWeight: 600 }}>List schedules</span>
                                <Space>
                                    <div className="filter" style={{ display: "flex", alignItems: "center" }}>
                                        <div className="filter-item">
                                            <div className="filter-item-label">DATE</div>
                                            <DatePicker
                                                name="startTime"
                                                format={'DD/MM/YYYY'}
                                                showTime
                                                onChange={handleSelectDateTime}
                                                inputReadOnly
                                                inputStyle={{ color: 'red' }}
                                                className="searchDateTime"
                                                style={{
                                                    height: "auto",
                                                    width: "auto",
                                                    borderRadius: "6px",
                                                    fontSize: "14px",
                                                    padding: "8px",
                                                    border: "1px solid #d9d9d9"
                                                }}
                                            />
                                        </div>

                                        <div className="filter-item">
                                            <div className="filter-item-label">FILM</div>
                                            <Select
                                                showSearch
                                                placeholder="Select Film"
                                                allowClear
                                                style={{ width: 300 }}
                                                onChange={handleFilmChange}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                value={selectedFilm ? selectedFilm : "Select Film"}
                                            >
                                                {dataFilm?.map((film) => (
                                                    <Option value={film.id} key={film.id} label={film.name}>
                                                        {film.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="filter-item">
                                            <div className="filter-item-label">ROOM</div>
                                            <Select
                                                showSearch
                                                placeholder="Select Room"
                                                allowClear
                                                style={{ width: 150, marginRight: 18 }}
                                                onChange={handleRoomChange}
                                                value={selectedRoom ? selectedRoom : "Select Room"}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {dataRoom?.map((room) => (
                                                    <Option value={room.id} key={room.id} label={room.name}>
                                                        {room.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="filter-item">
                                            <div className="filter-item-label hidden">Add</div>
                                            <Button onClick={() => {
                                                setIsShowForm(true);
                                                setIsAdding(true);
                                                form.setFieldsValue({
                                                    id: 0,
                                                    filmId: '',
                                                    roomId: '',
                                                    startTime: moment(new Date(), 'DD/MM/YYYY HH:mm'),
                                                    price: 0
                                                })
                                            }}
                                                className="ant-btn ant-btn-primary">
                                                <i className="fa-solid fa-plus" style={{ marginRight: 6 }}></i>
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </Space>

                            </div>
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={dataSource}
                                    loading={loading}
                                    pagination={{
                                        position: ["bottomCenter"],
                                        current: page,
                                        pageSize: pageSize,
                                        total: totalItem,
                                        showSizeChanger: true,
                                        pageSizeOptions: ['5', '10', '15'],
                                        onChange: (page, pageSize) => {
                                            setPage(page);
                                            setPageSize(pageSize);
                                        }
                                    }}
                                    className="ant-border-space"
                                />
                                <Modal
                                    title={isAdding ? "Add Schedule" : "Edit Schedule"}
                                    visible={isShowForm}
                                    okText="Submit"
                                    onCancel={() => { setIsShowForm(false); setIsAdding(false); setIsEditing(false) }}
                                    onOk={() => {
                                        form.validateFields().then(() => {
                                            isAdding ? onAdd() : onEdit();
                                        });
                                    }}
                                >
                                    <Form
                                        form={form}
                                        labelCol={{ span: 5 }}
                                        wrapperCol={{ span: 18 }}
                                        layout="horizontal"
                                    >
                                        {isEditing && <Form.Item name="id" label="Id" rules={[{ required: true }]}>
                                            <Input
                                                disabled
                                            />
                                        </Form.Item>}
                                        <Form.Item name="filmId" label="Film"

                                            rules={[
                                                { required: true, message: "Select the film" },
                                            ]}
                                        >
                                            <Select name="filmId"
                                                allowClear
                                                placeholder="Select a film"
                                            >
                                                {dataFilm?.map(item => (
                                                    <Option value={item.id} key={item.id}>
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item name="roomId" label="Room"

                                            rules={[
                                                { required: true, message: "Select the room" },
                                            ]}
                                        >
                                            <Select name="roomId"
                                                allowClear
                                                placeholder="Select a room"
                                            >
                                                {dataRoom?.map(item => (
                                                    <Option value={item.id} key={item.id}>
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="startTime" label="Start Time" rules={[{ required: true, message: "Start time is required" }]}>
                                            <DatePicker
                                                name="startTime"
                                                format={'DD/MM/YYYY HH:mm'}
                                                showTime
                                                disabledDate={(current) => current.isBefore(dayjs(new Date().setDate(new Date().getDate() - 1)))}
                                                style={{
                                                    height: "auto",
                                                    width: "auto",
                                                    borderRadius: "6px",
                                                    fontSize: "14px",
                                                    padding: "8px"
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="price"
                                            label="Price"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Price is required",
                                                },
                                                {
                                                    type: "number",
                                                    min: 10000,
                                                    max: 10000000,
                                                }
                                            ]}
                                        >
                                            <InputNumber style={{ width: '100%', borderRadius: '6px' }} />
                                        </Form.Item>

                                    </Form>
                                </Modal>
                            </div>

                        </Card>
                    </Col>
                </Row>
            </div>
            {selectedRoom && ( <>
            <h3 style={{textAlign: 'center'}}>Schedules of Room</h3>
            <CalendarTest events={schedulesOfRoomSelected}/>
            </>)}
        </>
    );
}

export default SchedulesTable;


