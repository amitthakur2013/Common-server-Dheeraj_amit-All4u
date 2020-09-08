const axios = require("axios");

const sendText = async (phoneNumber, message) => {
  let url = `http://msg.boraitgroup.com/api/SmsApi/SendSingleApi?UserID=shrinathoptics&Password=pass1234&SenderID=ONLINE&Phno=${phoneNumber}&Msg=${message}`;
  let res = await axios.get(url);

  console.log(res.data);
};

module.exports = sendText;
