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

app.use("/static", express.static(path.join(__dirname, "public")));
app.get("/", (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/music", (req: Request, res: Response) => {
  res
    .status(200)
    .sendFile(
      path.join("C:\\Users\\medde\\Downloads\\music", "Soolking - Askim.mp3")
    );
});

io.on("connect", (socket: any) => {
  console.log("user connected", socket.handshake.query);
  const room = socket.handshake.query.room;
  socket.join(room);
  setTimeout(() => {
    console.log("emit");
    socket.to(room).emit("message", "some data");
  }, 2000);
  socket.on("change_song", (song: string) => {
    socket.to(room).emit("change_song", song);
  });
  socket.on("seeking", (currentTime: number) => {
    socket.to(room).emit("seeking", currentTime);
  });
  socket.on("pause", () => {
    socket.to(room).emit("pause");
  });
  socket.on("play", () => {
    socket.to(room).emit("play");
  });
  socket.on("disconnect", () => {
    // disconnectUser(socket.id);
    console.log("user disconnect");
  });
});

const PORT: Number = config.PORT;

server.listen(PORT, () =>
  debug(`server is running on ${config.NODE_ENV} mode on PORT ${PORT}`)
);
