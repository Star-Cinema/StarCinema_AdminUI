/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
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
    Dropdown,
    Menu
  } from "antd";
  
  import { ToTopOutlined } from "@ant-design/icons";
  import { Link } from "react-router-dom";
  
  import { useEffect, useState } from "react";
  import axios from "axios";
  
  
  const { Title } = Typography;
  
  // table code start
  const columns = [
    {
      title: "ScheduleId",
      dataIndex: "id",
      key: "id",
      width: "32%",
    },
    {
      title: "Tên phim",
      dataIndex: "filmName",
      key: "filmName",
    },
  
    // {
    //   title: "STATUS",
    //   key: "status",
    //   dataIndex: "status",
    // },
    // {
    //   title: "EMPLOYED",
    //   key: "employed",
    //   dataIndex: "employed",
    // },
  ];
  
  
  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ];
  
  
  function Tables() {
  
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const onChange = (e) => console.log(`radio checked:${e.target.value}`);
  
  
    useEffect(()=> {
      getRecords(0);
    }, [])
    
    const getRecords = (page) => {
      setLoading(true);
      axios.get(`https://localhost:7113/api/Schedules?page=${page}&limit=10`)
      .then((res) => {
        setDataSource(res.data.data.listItem);
        setTotalPages(res.data.data.totalPage);
        setLoading(false);
      })
    }
  
    const [visible, setVisible] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item key="1">Option 1</Menu.Item>
      <Menu.Item key="2">Option 2</Menu.Item>
      <Menu.Item key="3">Option 3</Menu.Item>
    </Menu>
  );

    return (
      <>
        <div className="tabled">
          <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
              <Card
                bordered={false}
                className="criclebox tablespace mb-24"
                title="Booking"
                extra={
                  <>
                    <Radio.Group onChange={onChange} defaultValue="a">
                      <Radio.Button value="a">All</Radio.Button>
                      <Radio.Button value="b">ONLINE</Radio.Button>
                    </Radio.Group>
                  </>
                }
              >
                {/* <div className="table-responsive">
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                      pageSize: 10, 
                      totalPages: totalPages,
                      onChange: (page) => {
                        getRecords(page);
                      }
                    }}
                    className="ant-border-space"
                  />
                </div>
                {console.log(dataSource)} */}
  
  <Dropdown
      overlay={menu}
      onVisibleChange={(v) => setVisible(v)}
      visible={visible}
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        Click me
      </a>
    </Dropdown>


              </Card>

            </Col>
          </Row>
        </div>
      </>
    );
  }
  
  export default Tables;
  