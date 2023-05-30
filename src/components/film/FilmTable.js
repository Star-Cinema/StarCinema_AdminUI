import { React, useState, useEffect } from "react";
import axios from "axios";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import { Space, Table, Image, Tooltip, Button, Form, Select } from "antd";
import FilmDelete from "./FilmDelete";
import FilmCreate from "./FilmCreate";
import FilmUpdate from "./FilmUpdate";
const { Option } = Select;

//START REGION
//VYVNK1 FUNCTION TO DISPLAY LIST OF FILM
const FilmTable = () => {
  const [filmAPI, setFilmAPI] = useState([]);
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
        .get(
          `https://localhost:7113/api/Films?search=${searchData}&page=0&limit=10`
        )
        .then((response) => {
          setBusy(false);
          setFilmAPI(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    fetchData();
  };

  useEffect(() => {
    loadData();
  }, []);

  if (filmAPI.length != 0) {
    filmAPI.data.listItem.map((c, key) => {
      data.push({
        key: key,
        image: c.images[0].path,
        id: c.id,
        name: c.name,
        categoryId: c.category.id,
        category: c.category.name,
        director: c.director,
        producer: c.producer,
        country: c.country,
        description: c.description,
        release: c.release,
        videoLink: c.videoLink,
        duration: c.duration,
      });
    });
  }

  // GET LIST CATEGORY
  const [listCategory, setListCategory] = useState([]);

  const loadCategory = () => {
    async function fetchData() {
      axios
        .get("https://localhost:7113/api/Categories?page=0&limit=10")
        .then((response) => {
          setBusy(false);
          setListCategory(response.data.data.listItem);
        });
    }

    fetchData();
  };

  useEffect(() => {
    loadCategory();
  }, []);
  // END GET LIST CATEGORY

  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <Image
          style={{ borderRadius: "10px" }}
          width={70}
          height={80}
          src={record.image}
        />
      ),
    },
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      hidden: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "CategoryId",
      dataIndex: "categoryId",
      key: "categoryId",
      hidden: true,
    },
    {
      title: "Director",
      dataIndex: "director",
      key: "director",
      hidden: true,
    },
    {
      title: "producer",
      dataIndex: "producer",
      key: "producer",
      hidden: true,
    },
    {
      title: "country",
      dataIndex: "country",
      key: "country",
      hidden: true,
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
      hidden: true,
    },
    {
      title: "release",
      dataIndex: "release",
      key: "release",
      hidden: true,
    },
    {
      title: "videoLink",
      dataIndex: "videoLink",
      key: "videoLink",
      hidden: true,
    },
    {
      title: "duration",
      dataIndex: "duration",
      key: "duration",
      hidden: true,
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <FilmUpdate
            id={record.id}
            image={record.image}
            name={record.name}
            category={record.category}
            categoryId={record.categoryId}
            director={record.director}
            producer={record.producer}
            country={record.country}
            description={record.description}
            release={record.release}
            videoLink={record.videoLink}
            duration={record.duration}
            loadData={loadData}
            listCategory={listCategory}
          />
          <FilmDelete id={record.id} name={record.name} loadData={loadData} />
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
          <FilmCreate loadData={loadData} listCategory={listCategory} />

          <Space style={{ margin: "1.5em" }} direction="horizontal">
            <Input
              placeholder="Search Film..."
              onChange={(e) => handleChange(e)}
              maxLength={50}
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

          <Table
            columns={columns.filter((item) => !item.hidden)}
            dataSource={data}
          />
        </>
      )}
    </>
  );
};
// END REGION
export default FilmTable;
