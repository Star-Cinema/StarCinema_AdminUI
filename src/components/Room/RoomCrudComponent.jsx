import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Space, Button, notification } from "antd";

const RoomCrudComponent = () => {
    const [rooms, setRooms] = useState([]);
    const [roomApis, setRoomApis] = useState([]);
    const [newRoom, setNewRoom] = useState({ name: "", isDelete: false });
    var token = sessionStorage.getItem("token");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

    useEffect(() => {
        fetchRooms();
    }, [pagination]);

    const fetchRooms = async () => {
        try {
            const response = await axios.get(
                "https://localhost:7113/api/Room?PageIndex=0&PageSize=10&SortColumn=Name&SortOrder=ASC",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            ); // Replace with your API endpoint
            const newArr = response.data.data.map((item) => {
                // Perform transformation or manipulation on each item
                const { id, name } = item;
                return { id, name }; // Doubles each item in the original array
            });
            setRoomApis(newArr);
            setRooms(response.data.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const createRoom = async () => {
        try {
            const index = rooms.findIndex((item) => item.name === newRoom.name);
            if (index === -1) {
                const response = await axios.post(
                    "https://localhost:7113/api/Room",
                    newRoom,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Replace with your API endpoint
                //   setRooms([...rooms, response.data]);
                const responsee = await axios.get(
                    "https://localhost:7113/api/Room?PageIndex=0&PageSize=10&SortColumn=Name&SortOrder=ASC",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ); // Replace with your API endpoint
                setRooms(responsee.data.data);
                // setRoomApis([...responsee.data.data]);
                setNewRoom({ name: "", isDelete: false });
                notification.open({
                    message: "Notification",
                    description: "Add Room successfully!",
                    duration: 3,
                    placement: "topRight",
                });
            } else {
                notification.open({
                    message: "Notification",
                    description:
                        "Add Room unsuccessfully, duplicate data, please re-enter!",
                    duration: 3,
                    placement: "topRight",
                });
            }
        } catch (error) {
            console.error("Error creating room:", error);
            notification.open({
                message: "Notification",
                description:
                    "Add Room failed, Please enter data != null and length <= 50 characters!",
                duration: 3,
                placement: "topRight",
            });
        }
    };

    const updateRoom = async (roomId, updatedRoom) => {
        try {
            let newArr = rooms;
            const index = newArr.findIndex((item) => item.id === roomId);
            if (index !== -1) {
                newArr[index].name = updatedRoom.name; // Update the desired property directly
            }
            setRooms([...newArr]);
            console.log("data normal: ", rooms);
            console.log("data api: ", roomApis);
        } catch (error) {
            console.error("Error updating room:", error);
        }
    };
    const handleFormSubmit = async (roomId, name) => {
        if (name === null) {
            notification.open({
                message: "Notification",
                description: "Please enter a value!",
                duration: 3,
                placement: "topRight",
            });
        } else {
            const index = roomApis.findIndex((item) => item.name === name);
            // console.log("data api: ", roomApis);
            // console.log("index: ", index);
            // console.log("name: ", name);
            if (index === -1) {
                try {
                    const r = {
                        id: roomId,
                        name: name,
                        isDelete: false,
                    };
                    await axios.put(`https://localhost:7113/api/Room`, r, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }); // Replace with your API endpoint
                    notification.open({
                        message: "Notification",
                        description: "Update Room successfully!",
                        duration: 3,
                        placement: "topRight",
                    });
                    fetchRooms();
                } catch (error) {
                    console.error("Error updating room:", error);
                    notification.open({
                        message: "Notification",
                        description:
                            "Update Room Failed, please enter value not null!",
                        duration: 3,
                        placement: "topRight",
                    });
                }
            } else {
                notification.open({
                    message: "Notification",
                    description:
                        "Edit Room failed, Value is not null and not duplicate data, please re-enter!",
                    duration: 3,
                    placement: "topRight",
                });
            }
        }
    };
    const deleteRoom = async (roomId) => {
        console.log("room" + roomId);
        try {
            await axios.delete(`https://localhost:7113/api/Room?id=${roomId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }); // Replace with your API endpoint
            const updatedRooms = rooms.filter((room) => room.id !== roomId);
            setRooms(updatedRooms);
            notification.open({
                message: "Notification",
                description: "Delete Room successfully!",
                duration: 3,
                placement: "topRight",
            });
        } catch (error) {
            console.error("Error deleting room:", error);
            notification.open({
                message: "Notification",
                description: "Delete Room Failed!",
                duration: 3,
                placement: "topRight",
            });
        }
    };
    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Input
                    maxLength={50}
                    value={text}
                    onChange={(e) =>
                        updateRoom(record.id, {
                            name: e.target.value,
                            isDelete: record.isDelete,
                        })
                    }
                />
            ),
        },
        {
            title: "Action",
            dataIndex: "",
            align: "center",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        onClick={() => handleFormSubmit(record.id, record.name)}
                    >
                        Save
                    </Button>
                    <Button type="danger" onClick={() => deleteRoom(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];
    return (
        <div>
            <h1>Room Management</h1>
            <div>
                <Input
                    placeholder="Enter room name"
                    value={newRoom.name}
                    style={{ width: "50%", "margin-top": "0.5rem" }}
                    onChange={(e) =>
                        setNewRoom({ ...newRoom, name: e.target.value })
                    }
                />
                <Button
                    type="primary"
                    style={{ "margin-top": "0.5rem", "margin-left": "0.5rem" }}
                    onClick={createRoom}
                >
                    Create Room
                </Button>
            </div>
            <Table
                style={{ "margin-top": "1rem" }}
                dataSource={rooms}
                pagination={pagination}
                columns={columns}
                rowKey="id"
                onChange={handleTableChange}
            />
        </div>
    );
};

export default RoomCrudComponent;
