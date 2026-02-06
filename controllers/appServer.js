const express = require("express");
const appServer = express.Router();
//*=============== database No-Sql
const userDetails = require("../modules/userData");
const friendsDetails = require("../modules/userFriend");
//*=============== id format to letter
const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
//*=============== get new number id
const getID = () => {
  const id = Math.random().toString(36).slice(2);
  return id;
};
//*=============== get all number and create new number
async function formatIdToNumber(req, res, next) {
  let userNumber = null;
  const numbersStored = [];
  try {
    const findNumber = await userDetails.find();
    for (const element of findNumber) {
      numbersStored.push(element.userNumber);
    }
    console.log(numbersStored);
  } catch (error) {
    console.log(error);
  }
  do {
    const id = getID();
    const number = [];
    for (const element of id) {
      const num = Number(element);
      if (num) {
        number.push(element);
      } else {
        const letterToUpCase = element.toUpperCase();
        for (let i = 0; i < letters.length; i++) {
          if (letterToUpCase === letters[i]) {
            number.push(i);
          }
        }
      }
    }
    const formatNumber = number.join("");
    const modifyNumber = [];
    for (let i = 0; i < 10; i++) {
      modifyNumber.push(formatNumber.split("")[i]);
    }
    userNumber = `${modifyNumber[0]}${modifyNumber[1]}-${modifyNumber[2]}${modifyNumber[3]}${modifyNumber[4]}${modifyNumber[5]}-${modifyNumber[6]}${modifyNumber[7]}${modifyNumber[8]}${modifyNumber[9]}`;
  } while (numbersStored.includes(userNumber));
  res.userNumber = userNumber;
  next();
}
//*=============== save user to database
appServer.post("/register", formatIdToNumber, async (req, res) => {
  const data = req.body;
  const number = res.userNumber;
  try {
    const registerUser = await new userDetails({
      userName: data.username,
      userNumber: number,
      userPassword: data.password,
    });
    if (!registerUser)
      return res.status(500).json({ status: 500, massage: "Server error" });
    const responds = await registerUser.save();
    if (!responds.id)
      return res.status(500).json({ status: 500, massage: "Server error" });
    res.status(200).json({ status: 201, number: number });
  } catch (error) {
    console.log(error);
  }
});
//*================== login user to database
appServer.post("/v/login", async (req, res) => {
  const data = req.body;
  const userNumber = data.userNumber;
  const userPassword = data.userPassword;
  try {
    const findUser = await userDetails.find({
      userNumber: userNumber,
      userPassword: userPassword,
    });
    if (findUser.length === 0)
      return res
        .status(404)
        .json({ status: 404, massage: "User does not exist" });
    res.status(200).json({
      status: 200,
      massage: "login succesfull",
      authorization: null,
      number: findUser[0].userNumber,
    });
  } catch (error) {
    console.log(error);
  }
});
//*=============== save user contacts
appServer.post("/a/contact", async (req, res) => {
  const data = req.body;
  const userNumber = data.userNumber;
  const friendNumber = data.friendNumber;
  const friendName = data.friendName;
  try {
    const findUser = await userDetails.find({ userNumber: userNumber });
    if (findUser.length === 0)
      return res
        .status(403)
        .json({ status: 404, massage: "to add contact you need to sign-In" });
    const findFriend = await userDetails.find({ userNumber: friendNumber });
    if (findFriend.length === 0)
      return res.status(404).json({
        status: 404,
        massage: `${friendNumber} is not a valid Echo Number`,
      });
    const validateFriend = await friendsDetails.find({
      userId: userNumber,
      friendNumber: friendNumber,
    });
    if (validateFriend.length !== 0)
      return res
        .status(200)
        .json({ status: 200, massage: "Contact already exist" });
    const saveFriend = await new friendsDetails({
      userId: userNumber,
      friendName: friendName,
      friendNumber: friendNumber,
    });
    const responds = await saveFriend.save();
    if (!responds)
      return res
        .status(500)
        .json({ status: 500, massage: "server error try again later" });
    res.status(201).json({
      status: 200,
      massage: "Contact saved",
      friendName: friendName,
      friendNumber: friendNumber,
    });
  } catch (error) {
    console.log(error);
  }
});
//*=============== get users friend list
appServer.post("/g/u/friends", async (req, res) => {
  const data = req.body;
  const userNumber = data.userNumber;
  try {
    const findUser = await userDetails.find({ userNumber: userNumber });
    if (findUser.length === 0)
      return res
        .status(403)
        .json({ status: 403, massage: "In valide requst user does not exist" });
    const findFriends = await friendsDetails.find({ userId: userNumber });
    res
      .status(200)
      .json({ status: 200, massage: "succesful", friends: findFriends });
  } catch (error) {
    console.log(error);
  }
});

module.exports = appServer;
