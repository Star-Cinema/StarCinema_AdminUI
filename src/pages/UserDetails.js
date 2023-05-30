import { useEffect, useState } from "react";

import {
    Row,
    Col,
    Card,
    Button,
    List,
    Descriptions,
    Avatar,
    Radio,
    Switch,
    Upload,
    message,
    Form,
    Input,
    DatePicker,
    Select,
    Image,
    Typography,
    Popconfirm,
} from "antd";

import {
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    VerticalAlignTopOutlined,
    PlusOutlined,
    UploadOutlined
} from "@ant-design/icons";

import BgProfile from "../assets/images/bg-profile.jpg";
import profilavatar from "../assets/images/face-1.jpg";
import convesionImg from "../assets/images/face-3.jpg";
import convesionImg2 from "../assets/images/face-4.jpg";
import convesionImg3 from "../assets/images/face-5.jpeg";
import convesionImg4 from "../assets/images/face-6.jpeg";
import convesionImg5 from "../assets/images/face-2.jpg";
import project1 from "../assets/images/home-decor-1.jpeg";
import project2 from "../assets/images/home-decor-2.jpeg";
import project3 from "../assets/images/home-decor-3.jpeg";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import moment from "moment";

import {UploadImageAPI} from '../../src/assets/js/public.js'
const { Title } = Typography;

function UserDetails() {
    const history = useHistory()
    const [imageURL, setImageURL] = useState(false);
    const [form] = Form.useForm()
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false);
    const params = useParams()

    useEffect(() => {
        fecthData(params.id)
    }, [])


    //Get data when form load HungTD34
    const fecthData = async (id) => {
        var res = await axios.get("https://localhost:7113/api/users/" + id,
        {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`
            }
        })

        form.setFieldsValue({
            name: res?.data?.data?.name,
            email: res?.data?.data?.email,
            phone: res?.data?.data?.phone,
            dob: moment(new Date(res?.data?.data?.dob)),
            role: res?.data?.data?.roleDTO.name,
            gender: res?.data?.data?.gender
        })

        setFormData(res?.data?.data)
    }

    // const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    // };


    const handleChange = (e) => {
        if (e.target.name == "dob")
            form.setFieldsValue({
                [e.target.name]: moment(new Date(e.target.value), "yyyy:MM:DD")
            })
        else
            form.setFieldsValue({
                [e.target.name]: e.target.value
            })
    };

    //Set state of user when field is changes HungTD34
    const handleChangeDob = (e) => {
        setFormData({ ...formData, ['dob']: e });
    }

    //Request API to update user HungTD34
    const onFinish = async (values) => {
        const user = {
            email: values.email,
            name: values.name,
            phone: values.phone,
            dob: values.dob.toISOString(),
            gender: values.gender,
            avatar: imageURL? imageURL : formData?.avatar
        }

        var res = await axios.put("https://localhost:7113/api/users/" + params.id, user,
        {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                "Content-Type" : "application/json"
            }
        })
        if (res?.data?.code == 200) history.push("/users")
    }

    const handleUpload = async (e) =>{
        console.log(e.file)
        var url = await UploadImageAPI(e.file)
        setImageURL(url)
    }

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col span={24} md={16} className="mb-24">
                    <Card
                        bordered={false}
                        title={<h6 className="font-semibold m-0">Profile Information</h6>}
                        className="header-solid h-full card-profile-information"
                        // extra={<Button type="link">{pencil}</Button>}
                        bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                    >
                        <Form
                            form={form}
                            labelCol={{
                                span: 4,
                            }}
                            wrapperCol={{
                                span: 24,
                            }}
                            layout="vertical"
                            onFinish={onFinish}
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
                                <Input name="name" onChange={(e) => handleChange(e)} />
                            </Form.Item>
                            <Form.Item name="email" label="Email">
                                <Input name="email" disabled />
                            </Form.Item>
                            <Form.Item label="Phone" name="phone"
                                rules={[{ required: true },
                                {
                                    type: 'string',
                                    len: 10
                                }]}
                            >
                                <Input name="phone" onChange={(e) => handleChange(e)} />
                            </Form.Item>

                            <Form.Item label="Dob" name="dob"
                                rules={[{ required: true }]}
                            >
                                <DatePicker style={{ width: "100%" }} name="dob" onChange={(e) => handleChangeDob(e.toISOString())} />
                            </Form.Item>
                            <Form.Item label="Role" name="role">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item name='imageUpload'>
                                <Upload
                                    multiple={false}
                                    name="imageUpload"
                                    listType="picture"
                                    customRequest={handleUpload}
                                    // beforeUpload={() => false}
                                    defaultFileList={[]}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item label="Gender" name="gender"
                                rules={[{ required: true }]}
                            >
                                <Radio.Group name="gender" onChange={handleChange}>
                                    <Radio value={true}> Male </Radio>
                                    <Radio value={false}> FeMale </Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item style={{ textAlign: "center" }}>
                                <Button htmlType="submit" type="primary">Save</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col span={12} md={8} className="mb-24">
                    <Row>
                        <Col span={24} md={24}>
                            <Card
                                bordered={false}
                                title={<h6 className="font-semibold m-0">Conversations</h6>}
                                className="header-solid h-full"
                                bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}
                            >
                                <Row gutter={[24, 24]} style={{ textAlign: "center" }}>
                                    <Col span={24} md={24}>
                                        <Image
                                            width={200}
                                            height={200}
                                            src={imageURL? imageURL : formData?.avatar}
                                            style={{ objectFit: "cover" }}
                                        />
                                        <div className="avatar-info">
                                            <Title level={1} style={{ marginBottom: "0" }}>{formData?.name}</Title>
                                            <p>{formData?.email}</p>
                                        </div>
                                    </Col>
                                </Row>

                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {/* </Row> */}
            {/* <Card
        bordered={false}
        className="header-solid mb-24"
        title={
          <>
            <h6 className="font-semibold">Projects</h6>
            <p>Architects design houses</p>
          </>
        }
      >
        <Row gutter={[24, 24]}>
          {project.map((p, index) => (
            <Col span={24} md={12} xl={6} key={index}>
              <Card
                bordered={false}
                className="card-project"
                cover={<img alt="example" src={p.img} />}
              >
                <div className="card-tag">{p.titlesub}</div>
                <h5>{p.titile}</h5>
                <p>{p.disciption}</p>
                <Row gutter={[6, 0]} className="card-footer">
                  <Col span={12}>
                    <Button type="button">VIEW PROJECT</Button>
                  </Col>
                  <Col span={12} className="text-right">
                    <Avatar.Group className="avatar-chips">
                      <Avatar size="small" src={profilavatar} />
                      <Avatar size="small" src={convesionImg} />
                      <Avatar size="small" src={convesionImg2} />
                      <Avatar size="small" src={convesionImg3} />
                    </Avatar.Group>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
          <Col span={24} md={12} xl={6}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader projects-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageURL ? (
                <img src={imageURL} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Col>
        </Row>
      </Card> */}
        </>
    );
}

export default UserDetails;
