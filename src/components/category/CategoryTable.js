import { React, useState, useEffect } from "react";
import axios from "axios";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";

import { Space, Table, Input, Button } from "antd";
import CategoryCreate from "./CategoryCreate";
import CategoryDelete from "./CategoryDelete";
import CategoryUpdate from "./CategoryUpdate";

// START REGION
// VYVNK1 DISPLAY CATEGORY LIST

const CategoryTable = () => {
  const [categoryAPI, setCategoryAPI] = useState([]);
  const data = [];
  const [isBusy, setBusy] = useState(true);
  
    // VYVNK1 FUNCTION SEARCH
    const [searchData, setSearchData] = useState("");
    const [listSearch, setListSearch] = useState([]);
    const handleChange = (e) => {
      setSearchData(e.target.value);
    };
  
    const handleSearch = () => {
      console.log(searchData);
      loadData();
    };
    // END FUNCTION SEARCH

  const loadData = () => {
    setBusy(true);
    async function fetchData() {
      axios
        .get(`https://localhost:7113/api/Categories?name=${searchData}&page=0&limit=100`)
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
          <Space style={{ margin: "1.5em" }} direction="horizontal">
            <Input
              placeholder="Search Film..."
              onChange={(e) => handleChange(e)}
            />

            <Button
              shape="circle"
              onClick={handleSearch}
              style={{ background: "transparent" }}
              type="primary"
            >
              {" "}
              <SearchOutlined style={{ fontSize: "150%", color: "#1890ff" }} />
            </Button>
          </Space>
          <Table columns={columns} dataSource={data} />
        </>
      )}
    </>
  );
};
// END REGION
export default CategoryTable;
