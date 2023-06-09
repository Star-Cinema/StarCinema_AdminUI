import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { useState } from "react";
import axios from "axios";

// START REGION
// ANTD UPLOAD IMAGE COMPONENT

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Test = ({ fetchImgLink, imgPath }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [myFile, setMyFile] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: imgPath,
    },
  ]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    console.log(file.originFileObj);
    setPreviewImage(file.url || file.preview);

    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ file, fileList: newFileList, event }) => {
    file.status = "done";
    setMyFile(file.originFileObj);
    setFileList([file]);
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  //START REGION
  //VYVNK1 GET IMAGE LINK
  const getImageLink = async () => {
    const formData = new FormData();
    formData.append("file", myFile);
    formData.append("upload_preset", "ml_default");

    var data;
    var res = await axios
      .post("https://api.cloudinary.com/v1_1/dsirezdju/image/upload", formData)
      .then((response) => {
        data = response.data.url;
        //console.log(response.data.url);
        fetchImgLink(response.data.url);
      });

    return data;
  };

  const uploadImage = () => {
    const link = getImageLink().then((response) => {
      //console.log(response);
      fetchImgLink(response);
    });
  };
  // END REGION

  return (
    <>
      <Upload
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        customRequest={uploadImage}
        listType="picture-card"
        myFile={myFile}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {myFile != "" ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};
export default Test;
