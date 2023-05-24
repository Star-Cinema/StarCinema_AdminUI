import { React, useState, useEffect } from "react";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { Space, Table, Image } from "antd";
import FilmDelete from "./FilmDelete";
import FilmCreate from "./FilmCreate";
import FilmUpdate from "./FilmUpdate";

//START REGION
//VYVNK1 FUNCTION TO DISPLAY LIST OF FILM
const FilmTable = () => {
  const [filmAPI, setFilmAPI] = useState([]);
  const data = [];
  const [isBusy, setBusy] = useState(true);

  const loadData = () => {
    setBusy(true);
    async function fetchData() {
      axios
        .get("https://localhost:7113/api/Films?page=0&limit=10")
        .then((response) => {
          setBusy(false);
          setFilmAPI(response.data);
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

  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (_, record) => <Image style={{borderRadius:"10px"}} width={70} height={80} src={record.image} />,
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
          <FilmCreate loadData={loadData} />
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
