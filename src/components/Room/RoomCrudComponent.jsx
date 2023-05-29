import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Space, Button, notification } from "antd";

const RoomCrudComponent = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ name: "", isDelete: false });
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
                "https://localhost:7113/api/Room?PageIndex=0&PageSize=10&SortColumn=Name&SortOrder=ASC"
            ); // Replace with your API endpoint
            setRooms(response.data.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const createRoom = async () => {
        try {
            console.log("data: " + newRoom);
            const response = await axios.post(
                "https://localhost:7113/api/Room",
                newRoom
            ); // Replace with your API endpoint
            //   setRooms([...rooms, response.data]);
            const responsee = await axios.get(
                "https://localhost:7113/api/Room?PageIndex=0&PageSize=10&SortColumn=Name&SortOrder=ASC"
            ); // Replace with your API endpoint
            setRooms(responsee.data.data);
            setNewRoom({ name: "", isDelete: false });
            notification.open({
                message: "Notification",
                description: "Add Room successfully!",
                duration: 3,
                placement: "topRight",
            });
        } catch (error) {
            console.error("Error creating room:", error);
            notification.open({
                message: "Notification",
                description: "Add Room failed!",
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
        } catch (error) {
            console.error("Error updating room:", error);
        }
    };
    const handleFormSubmit = async (roomId, name) => {
        console.log("id: ", name);
        try {
            const r = {
                id: roomId,
                name: name,
                isDelete: false,
            };
            await axios.put(`https://localhost:7113/api/Room`, r); // Replace with your API endpoint
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
                description: "Update Room Failed!",
                duration: 3,
                placement: "topRight",
            });
        }
    };
    const deleteRoom = async (roomId) => {
        console.log("room" + roomId);
        try {
            await axios.delete(`https://localhost:7113/api/Room?id=${roomId}`); // Replace with your API endpoint
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
        // <div className="container">
        //     <h1>Room CRUD Component</h1>
        //     <div className="form">
        //         <input
        //             type="text"
        //             placeholder="Enter room name"
        //             value={newRoom.name}
        //             onChange={(e) =>
        //                 setNewRoom({ ...newRoom, name: e.target.value })
        //             }
        //         />
        //         <button onClick={createRoom}>Create Room</button>
        //     </div>
        //     <ul className="room-list">
        //         {rooms.map((room) => (
        //             <li key={room.id} className="room-item">
        //                 <input
        //                     type="text"
        //                     value={room.name}
        //                     onChange={(e) =>
        //                         updateRoom(room.id, {
        //                             name: e.target.value,
        //                             isDelete: room.isDelete,
        //                         })
        //                     }
        //                 />
        //                 <input
        //                     type="checkbox"
        //                     hidden="true"
        //                     checked={room.isDelete}
        //                     onChange={(e) =>
        //                         updateRoom(room.id, {
        //                             name: room.name,
        //                             isDelete: e.target.checked,
        //                         })
        //                     }
        //                 />
        //                 <button onClick={() => deleteRoom(room.id)}>
        //                     Delete
        //                 </button>
        //             </li>
        //         ))}
        //     </ul>
        // </div>
        <div>
            <h1>Room Management</h1>
            <div>
                <Input
                    placeholder="Enter room name"
                    value={newRoom.name}
                    style={{ width: "91%" }}
                    onChange={(e) =>
                        setNewRoom({ ...newRoom, name: e.target.value })
                    }
                />
                <Button type="primary" onClick={createRoom}>
                    Create Room
                </Button>
            </div>
            <Table
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
