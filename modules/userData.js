const mongose = require("mongoose");
const userSchema = mongose.Schema;
const userDetails = new userSchema({
  userName: {
    type: String,
    required: true,
  },
  userNumber: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
});
const userData = mongose.model("userDetails", userDetails);
module.exports = userData;
