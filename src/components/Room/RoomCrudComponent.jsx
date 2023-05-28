import React, { useState, useEffect } from "react";
import axios from "axios";

const RoomCrudComponent = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ name: "", isDelete: false });

    useEffect(() => {
        fetchRooms();
    }, []);

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
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    const updateRoom = async (roomId, updatedRoom) => {
        try {
            const r = {id: roomId, name: updatedRoom.name, isDelete: updatedRoom.isDelete};
            await axios.put(`https://localhost:7113/api/Room`, r); // Replace with your API endpoint
            const updatedRooms = rooms.map((room) =>
                room.id === roomId ? { ...room, ...updatedRoom } : room
            );
            console.log(r);
            setRooms(updatedRooms);
        } catch (error) {
            console.error("Error updating room:", error);
        }
    };

    const deleteRoom = async (roomId) => {
      console.log("room" + roomId);
        try {
            await axios.delete(`https://localhost:7113/api/Room?id=${roomId}`); // Replace with your API endpoint
            const updatedRooms = rooms.filter((room) => room.id !== roomId);
            setRooms(updatedRooms);
        } catch (error) {
            console.error("Error deleting room:", error);
        }
    };

    return (
        <div className="container">
      <h1>Room CRUD Component</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Enter room name"
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
        />
        <button onClick={createRoom}>Create Room</button>
      </div>
      <ul className="room-list">
        {rooms.map((room) => (
          <li key={room.id} className="room-item">
            <input
              type="text"
              value={room.name}
              onChange={(e) =>
                updateRoom(room.id, { name: e.target.value, isDelete: room.isDelete })
              }
            />
            <input
              type="checkbox"
              hidden="true"
              checked={room.isDelete}
              onChange={(e) =>
                updateRoom(room.id, { name: room.name, isDelete: e.target.checked })
              }
            />
            <button onClick={() => deleteRoom(room.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
    );
};

export default RoomCrudComponent;
