import config from "./config";

import express, { Request, Response } from "express";

import Debug from "debug";
import morgan from "morgan";
import { musicRoute } from "./music";
import path from "path";

// import sequelize from "./database";

const debug = Debug("app:startup");

const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.json());
app.use(morgan("tiny"));

// (async function () {
//   await sequelize.sync({ force: false });
// })().then(() => debug("init DB"));

app.use("/api/music", musicRoute);

app.get("/favicon.ico ", (req: Request, res: Response) => {
  app.use("/static", express.static(path.join(__dirname, "public")));
  res.status(200).end();
});
app.get("/", (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

type userSocketInfo = {
  _id: number;
  readyToListen: boolean;
};

let usersInTheRoom: userSocketInfo[] = [];

io.on("connect", (socket: any) => {
  console.log("user connected: ", socket.handshake.query._id);
  const _id = socket.handshake.query._id;
  const room = socket.handshake.query.room;
  usersInTheRoom.push({
    _id,
    readyToListen: false,
  });
  debug(usersInTheRoom);
  socket.join(room);
  socket.on("can_play", () => {
    debug(_id + " is ready");
    const idx: number = usersInTheRoom.findIndex((u) => u._id === _id);
    if (idx === -1) return;
    usersInTheRoom[idx].readyToListen = true;
    const notReady = usersInTheRoom.find((u) => !u.readyToListen);
    debug(usersInTheRoom);
    if (!notReady) {
      debug("all ready to listen");
    }
    socket.to(room).emit("play", { play: !notReady });
    socket.emit("play", { play: !notReady });
  });

  socket.on("change_song", (song: string) => {
    debug(_id + " : change_song");
    usersInTheRoom = usersInTheRoom.map((u) => ({
      ...u,
      readyToListen: false,
    }));
    socket.to(room).emit("change_song", song);
  });
  socket.on("seeking", (currentTime: number) => {
    debug(_id + " seeking");
    socket.to(room).emit("seeking", currentTime);
  });
  socket.on("pause", () => {
    debug(_id + " pause");
    socket.to(room).emit("pause");
  });
  socket.on("play", () => {
    debug(_id + " play");
    socket.to(room).emit("play", { play: true });
  });
  socket.on("disconnect", () => {
    usersInTheRoom = usersInTheRoom.filter((u) => u._id !== _id);
    console.log("user disconnect");
    debug(usersInTheRoom);
  });
});

const PORT: Number = config.PORT;

server.listen(PORT, () =>
  debug(`server is running on ${config.NODE_ENV} mode on PORT ${PORT}`)
);
