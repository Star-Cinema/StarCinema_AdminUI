////////////////////////////////////////////////////////////////////////////////////////////////////////
//FileName: Service.js
//FileType: Javascript Source file
//Author : TuNT37
//Created On : 22/05/2023
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
    Input,
    Space
} from "antd";

import { DeleteOutlined, EditTwoTone } from "@ant-design/icons";

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
        key: "id",
        dataIndex: "id",
        title: "Id",
    },
    {
        key: "name",
        dataIndex: "name",
        title: "Service name",
    },
    {
        key: "price",
        dataIndex: "price",
        title: "price",
    },
    {
        key: "actions",
        dataIndex: "actions",
        title: "Actions",
    },
];

export default function Service() {

    const [form] = Form.useForm();

    const [services, setServices] = useState([]);   // TuNT37 state services

    const [loading, setLoading] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [page, setPage] = useState(1);
    const [keySearch, setKeySearch] = useState(''); // TuNT37 keyword search 

    const [isShowCreate, setIsShowCreate] = useState(false);    // TuNT37 set show form create
    const [isShowEdit, setIsShowEdit] = useState(false);        // TuNT37 set show form edit 

    const [formData, setFormData] = useState({
        name: '',
        price: '',
    });

    // TuNT37 set page 
    useEffect(() => {
        setPage(1);
    }, [pageSize])

    // TuNT37 Call api and reRender record when change page/pageSize
    useEffect(() => {
        getRecords(page, pageSize);
    }, [page, pageSize])

    // TuNT37 handle show modal form create booking
    const handleShowFormCreate = async () => {
        await setIsShowCreate(true);
    }

    // TuNT37 handle show modal form Edit booking
    const handleShowFormEdit = async (id) => {
        await setIsShowEdit(true);
    }

    // TuNT37 handle delete and cofirm booking 
    const onDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                await axios.delete(`https://localhost:7113/api/Service/DeleteService?id=${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                getRecords(page, pageSize);
            }
        });
    }

    // TuNT37 Get all record booking 
    const getRecords = (page, pageSize) => {
        setLoading(true);
        axios.get(`https://localhost:7113/api/Service/GetAllServices?keySearch=${keySearch}&page=${page-1}&pageSize=${pageSize}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                const data = [];
                if (res.data != null) {
                    res.data.data.listItem.map((item, index) => {
                        data.push({
                            key: item.id,
                            id: (
                                <>{item.id}</>
                            ),
                            name: (
                                <>{item.name}</>
                            ),
                            price: (
                                <>{item.price}</>
                            ),
                            actions: (
                                <>
                                    <EditTwoTone onClick={() =>  
                                    {
                                        handleShowFormEdit(item.id);
                                        form.setFieldsValue({
                                            id: item.id,
                                            name: item.name,
                                            price: Number(item.price)
                                        })
                                    }} 
                                    style={{ fontSize: 18, cursor: "pointer", marginRight: 10 }}></EditTwoTone>
                                    <DeleteOutlined onClick={() => onDelete(item.id)} style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}></DeleteOutlined>
                                </>
                            )
                        })
                    })
                }
                setServices(data);
                setTotalItem(res.data.data.totalCount);
                setLoading(false);
            })
    }

    // TuNT37 handle on change value 
    const handleOnChange = async (e, name) => {
        let value = e.target.value;
        console.log(name + ' ' + value);
        if (!isNaN(value) && value){
            setFormData({ 
                ...formData, 
                [name]: value
            });
        }
    }

    // TuNT37 handle Edit Service when submit Edit
    const handleEdit = async () => {
        const values = form.getFieldsValue();
        let _formData = {
            id: values.id,
            name: values.name,
            price: values.price,
        }
        console.log('-form ', _formData);
        await axios.put(`https://localhost:7113/api/Service/UpdateService`, _formData,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log('response: ', response);
        });
        getRecords(page, pageSize);
        setIsShowEdit(false);
    }

    // TuNT37 handle Create Service when submit create
    const handleCreate = async () => {
        const values = form.getFieldsValue();
        let _formData = {
            name: values.name,
            price: values.price,
        }
        await axios.post(`https://localhost:7113/api/Service/CreateService`, _formData,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log('response: ', response);
        });
        getRecords(page, pageSize);
        setIsShowCreate(false);
    }

    //Request API to search Booking
    const handleSearch = () => {
        getRecords(page, 10, keySearch)
    }

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card bordered={false} className="criclebox tablespace mb-24" >
                            <div style={HeaderTableStyles}>
                                <span style={{ fontSize: 20, fontWeight: 600 }}> List Services </span>
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
                                    <Button onClick={async () => await handleShowFormCreate()} className="ant-btn ant-btn-primary">
                                        <i className="fa-solid fa-plus" style={{ marginRight: 6 }}></i>
                                        Add
                                    </Button>
                                </Space>
                            </div>
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={services}
                                    loading={loading}
                                    pagination={{
                                        defaultCurrent: 5,
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

                                <Modal title='Create Service' 
                                    visible={isShowCreate} 
                                    onOk={() => {form.validateFields().then(handleCreate)} } 
                                    onCancel={() => {
                                        setIsShowCreate(false);
                                        form.resetFields();
                                }}>
                                    <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} layout="horizontal" style={{ alignContent: "center" }} >
                                        
                                    <Form.Item
                                            name="name"
                                            label="Name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Name is required",
                                                }
                                            ]}
                                        >
                                            <Input
                                                name="name"
                                                type="text"
                                                onChange={(e)=>handleOnChange(e, 'name')}
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
                                                onChange={(e)=>handleOnChange(e, 'price')}
                                            />
                                        </Form.Item>

                                    </Form>
                                </Modal>

                                <Modal title='Edit Service' 
                                    visible={isShowEdit} 
                                    onOk={() => {form.validateFields().then(handleEdit)} } 
                                    onCancel={() => {
                                        setIsShowEdit(false);
                                        form.resetFields();
                                }}>
                                    <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} layout="horizontal" style={{ alignContent: "center" }} >

                                     <Form.Item
                                            name="id"
                                            label="id"
                                        >
                                            <Input
                                                name="id"
                                                disabled
                                            />
                                    </Form.Item>   

                                    <Form.Item
                                            name="name"
                                            label="Name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Name is required",
                                                }
                                            ]}
                                        >
                                            <Input
                                                name="name"
                                                type="text"
                                                onChange={(e)=>handleOnChange(e, 'name')}
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
                                                onChange={(e)=>handleOnChange(e, 'price')}
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




