import "dotenv/config";
import express from "express";
import cors from "cors";
import dbInit from "./db/mongo";
import routeUser from "./route/user.route";
import routeLocation from "./route/location.route";
import routeComment from "./route/comment.route";
import routePublication from "./route/publication.route";
import routeActivity from "./route/activity.route";
import routeApplication from "./route/application.route";
import routeRatings from "./route/ratings.route";
import {
  deleteLocalFileUser,
  uploadUser,
} from "./controller/multer/userMulter.ctrl";
import {
  deleteLocalFilePublication,
  uploadPublication,
} from "./controller/multer/publicationMulter.ctrl";
import http from "http";
import { createServer } from "http";
import { Server } from "socket.io";
import socket from "./chat/server";
//import config from "./config/default";
import log from "./utils/logger";

//const { port, host, corsOrigin } = config;
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

dbInit().then(() => console.log("Connection to MongoDB is ready"));

app.listen(PORT, () => console.log(`Hey! Listening on port ${PORT}`));

app.use(uploadUser.single("photoUser"), routeUser);
app.use(routeLocation);
app.use(routeComment);
app.use(routeRatings);
app.use(
  uploadPublication.single("photoPublication"),
  routePublication,
  deleteLocalFilePublication as express.RequestHandler
);
app.use(routeActivity);
app.use(routeApplication);

/*httpServer.listen(port, host, () => {
  log.info(`🚀 Server version 1.0.0 is listening 🚀`);
  log.info(`http://${host}:${port}`);

  socket({ io });
});*/
