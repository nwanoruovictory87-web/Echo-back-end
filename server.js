const express = require("express");
const app = express();
const SocketIo = require("socket.io");
//*=============== database
const friendsDetails = require("./modules/userFriend");
const userDetails = require("./modules/userData");
//*=============== alowe cors from client
const cors = require("cors");
//*=============== server user cross origin resource sharing (cors)
app.use(cors({ origin: "http://localhost:5173" }));
//*=============== use json to format data requst
app.use(express.json());
//*===============
const bodyPaser = require("body-parser");
app.use(bodyPaser.urlencoded({ extended: false }));
//*=============== routers
const appServer = require("./controllers/appServer");
//*=============== append server to app router
app.use("/user", appServer);
//*=============== use file router
const fileRouter = require("./controllers/file");
//*=============== use file router
app.use("/user/f/upload", fileRouter);
//*=============== database No-Sql
const mongose = require("mongoose");
//*=============== connect to database
mongose.connect("mongodb://localhost:27017/").then(() => {
  console.log("connected to database");
  //*===============  server port
  const serverPort = app.listen(5000, () => {
    console.log("Server listing on port 5000");
  });
  //*=============== get io and mack connnection to server port
  const io = SocketIo(serverPort, {
    //*=============== io sever connnection takes serverport as first agument ( must ) and cors as secound agument ( optional )
    //*=============== get cors // cors tells the server which port our client is on cors takes origin as a propaty name
    cors: {
      origin: ["http://localhost:5173"],
    },
  });
  //*=============== make handshake with io as our socket port
  io.on("connect", (socket) => {
    //*=============== connect takes a callback which accepts a second paramiter as (socket)=> is datainfo of the clients connection  socket also has object method as io
    //*=============== send private massages
    socket.on("send-massage", (massage, room) => {
      //*===============
      async function saveChatHistory() {
        const userNumber = massage.from;
        const friendNumber = room;
        const type = massage.type;
        console.log(type);
        try {
          //*=============== find user and update chat
          const findFriend = await friendsDetails.find({
            userId: userNumber,
            friendNumber: friendNumber,
          });
          if (findFriend.length === 0) return;
          const oldChatHistory = findFriend[0].friendMassages;
          const massageFormat = massage;
          const chatHistory = [...oldChatHistory, massageFormat];
          const updateUserChatHistory = await friendsDetails.updateOne(
            { userId: userNumber, friendNumber: friendNumber },
            { $set: { friendMassages: chatHistory } },
          );
          if (!updateUserChatHistory.acknowledged) return;
          //*=============== find friend and update chat
          const findUser = await friendsDetails.find({
            userId: friendNumber,
            friendNumber: userNumber,
          });
          let pass = true;
          //*=============== if friend dosent exist validate user does exist and and friend with friend number
          if (findUser.length === 0) {
            pass = false;
            const findUser = await userDetails.find({
              userNumber: friendNumber,
            });
            if (findUser.length === 0) return;
            //*=============== create user friend
            const saveFriend = await new friendsDetails({
              userId: friendNumber,
              friendName: userNumber,
              friendNumber: userNumber,
            });
            const responds = await saveFriend.save();
            if (responds.length === 0) return;
            pass = true;
          }
          if (!pass) return;
          const useroldChatHistory = findUser[0].friendMassages;
          const userMassageFormat = massage;
          const userChatHistory = [...useroldChatHistory, userMassageFormat];
          const updateUserFriendChatHistory = await friendsDetails.updateOne(
            { userId: friendNumber, friendNumber: userNumber },
            { $set: { friendMassages: userChatHistory } },
          );
          if (
            updateUserChatHistory.acknowledged &&
            updateUserFriendChatHistory.acknowledged
          ) {
            console.log("succesful");
          }
        } catch (error) {
          console.log(error);
        }
      }
      saveChatHistory();
      socket.to(room).emit("recive-massage", massage);
    });
    //*============== send group massages
    socket.on("group-massage", (massage, group) => {
      socket.to(group).emit(massage);
    });
    //*=============== connect each user to a room
    socket.on("join-room", (room) => {
      socket.join(room);
    });
    //*=============== connnect users to a group
    socket.on("join-group", (group) => {
      socket.join(group);
    });
  });
});
