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

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Authors Table"
              extra={
                <>
                  <Radio.Group onChange={onChange} defaultValue="a">
                    <Radio.Button value="a">All</Radio.Button>
                    <Radio.Button value="b">ONLINE</Radio.Button>
                  </Radio.Group>
                </>
              }
            >
              <div className="table-responsive">
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
              {console.log(dataSource)}

            </Card>

            
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Tables;
