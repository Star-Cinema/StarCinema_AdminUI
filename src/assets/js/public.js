import axios from "axios";

//Request API to upload image in to Cloudinary HungTD34
export const UploadImageAPI = async (file) => {
    const formData = new FormData();

    //Add file in to formData to upload file HungTD34
    formData.append("file", file)

    //Add name of presets config HungTD34
    formData.append("upload_preset", "ml_default")

    var data
    var res = await axios.post(
        "https://api.cloudinary.com/v1_1/dsirezdju/image/upload",
        formData
    ).then((response) => {
        data = response.data.url
    })

    return data

}