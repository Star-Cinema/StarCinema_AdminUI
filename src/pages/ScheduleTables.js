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
    Space
} from "antd";

import '../assets/styles/schedulePage.css';
import {  DeleteOutlined,  EditTwoTone,  } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

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
            const dataRoomAPI = await axios.get(`https://localhost:7113/api/Room?PageIndex=0&PageSize=100&SortColumn=Name&SortOrder=ASC`);
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



    // handle delete scheduled AnhNT282
    const onDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                await axios.delete(`https://localhost:7113/api/Schedules/${id}`);
                getRecords();
            }
        });
    }
    // handle add schedule AnhNT282
    const onAdd = async () => {
        setIsShowForm(false)
        setIsAdding(false);
        const startTime = form.getFieldValue('startTime')?.toISOString();
        const formData = {...form.getFieldsValue(), startTime: startTime};
        await axios.post(`https://localhost:7113/api/Schedules`, formData);
        getRecords();
    };
    // handle edit schedule AnhNT282
    const onEdit = async () => {
        setIsShowForm(false)
        setIsEditing(false);
        const startTime = form.getFieldValue('startTime')?.toISOString();
        const formData = {...form.getFieldsValue(), startTime: startTime};
        await axios.put(`https://localhost:7113/api/Schedules/${formData.id}`, formData);
        getRecords();
    };

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
                                <>{item.ticket.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</>
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
                                                style={{ background: "#237804", color: "#ffffff" }}>
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
                                        pageSizeOptions: ['10', '30', '50'],
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
                                                disabledDate={(current) => current.isBefore(moment())}
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
                                                }
                                            ]}
                                        >
                                            <Input
                                                name="price"
                                                type="number"
                                            />
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

export default SchedulesTable;


