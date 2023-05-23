import { React, useState, useEffect } from "react";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { Space, Table, Tooltip, Modal } from "antd";
import CategoryCreate from "./CategoryCreate";
import CategoryDelete from "./CategoryDelete";
import CategoryUpdate from "./CategoryUpdate";

const CategoryTable = () => {
  const [categoryAPI, setCategoryAPI] = useState([]);
  const data = [];
  const [isBusy, setBusy] = useState(true);

  const loadData = () => {
    setBusy(true);
    async function fetchData() {
      axios
        .get("https://localhost:7113/api/Categories?page=0&limit=100")
        .then((response) => {
          setBusy(false);
          setCategoryAPI(response.data);
        });
    }

    fetchData();
  };

  useEffect(() => {
    loadData();
  }, []);

  if (categoryAPI.length != 0) {
    categoryAPI.data.listItem.map((c, key) => {
      data.push({
        key: key,
        id: c.id,
        name: c.name,
      });
    });
  }

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <CategoryUpdate id={record.id} name={record.name} loadData={loadData}/>
          <CategoryDelete
            id={record.id}
            name={record.name}
            loadData={loadData}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      {isBusy ? (
        <></>
      ) : (
        <>
          <CategoryCreate loadData={loadData} />
          <Table columns={columns} dataSource={data} />
        </>
      )}
    </>
  );
};

export default CategoryTable;
