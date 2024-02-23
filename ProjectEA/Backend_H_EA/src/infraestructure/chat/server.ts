/*import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import log from "../utils/logger";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  log.info(`Sockets enabled`);

  io.on(EVENTS.connection, (socket: Socket) => {
    console.log("Socket connected:", socket.connected);

    log.info(`User connected ${socket.id}`);
    socket.emit(EVENTS.SERVER.ROOMS, rooms);
    console.log("EL SIGUIENTE CONSOLE LOG ES LAS ROOMS")
    console.dir(rooms)

    
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      console.log("EL SIGUIENTE CONSOLE LOG ES ROOMNAME")
      console.log(roomName);
      // create a roomId
      const roomId = uuidv4();
      console.log("EL SIGUIENTE LOG ES LA ROOMID")
      console.dir(roomId)
      // add a new room to the rooms object
      rooms[roomId] = {
        name: roomName,
      };
      console.log("Room ID: "+roomId);
      console.log("RoomSSS: "+JSON.stringify(rooms[roomId]));
      if (io.sockets.adapter.rooms.has(roomId)) {
        // action when room already exists
      } else {
        console.log(socket.id + 'tried to join ' + roomId + ' but the room does not exist.');
        // action when room is new
      };
      socket.join(roomId);
      console.log(roomId)
      console.log(`User ${socket.id} joined room ${roomId}`);

      // broadcast an event saying there is a new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
      console.log(`Broadcasted new room event to all users: `+JSON.stringify(rooms));

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);
      console.log(`Emitted all rooms to the room creator: `+JSON.stringify(rooms));

      // emit event back to the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
      console.log(`Emitted joined room event to the room creator: ${roomId}`);
    });

 

    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      async ({ roomId, message, username }) => {
        const { default: nanoid } = await import("nanoid");

        const date = new Date();

        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );

    
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId);

      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
  
}

export default socket;*/
import { v4 as uuidv4 } from "uuid";
import { Server, Socket } from "socket.io";
import log from "../utils/logger";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  log.info("Sockets enabled");

  io.on(EVENTS.connection, (socket: Socket) => {
    log.info(`User connected ${socket.id}`);

    socket.emit(EVENTS.SERVER.ROOMS, rooms);

    /*
     * When a user creates a new room
     */
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      console.log({ roomName });
      // create a roomId
      const roomId = uuidv4(); // add a new room to the rooms object
      rooms[roomId] = {
        name: roomName,
      };

      socket.join(roomId);

      // broadcast an event saying there is a new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);
      // emit event back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });

    /*
     * When a user sends a room message
     */

    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {
        const date = new Date();

        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );

    /*
     * When a user joins a room
     */
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId);

      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
}

export default socket;
