const mongose = require("mongoose");
const Schema = mongose.Schema;
const friendsSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  friendName: {
    type: String,
    required: true,
  },
  friendNumber: {
    type: String,
    required: true,
  },
  friendMassages: {
    type: Array,
    required: false,
  },
});

const friendsData = mongose.model("friends", friendsSchema);
module.exports = friendsData;
