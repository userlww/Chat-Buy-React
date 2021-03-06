const express = require("express");
const model = require("./model");
const Chat = model.chat;
const Router = express.Router();

// 获取所有聊天信息
Router.post("/getMessageList", function(req, res) {
  const { id } = req.decoded;
  Chat.find({
    messageId: { $regex: id }
  }).exec(function(err, doc) {
    if (err) {
      return res.json({ code: 1 });
    }
    return res.json({ code: 0, data: doc });
  });
});
// 清除未读消息
Router.post("/cleanNoRead", function(req, res) {
  const { id } = req.decoded;
  const { messageId, readId } = req.body;
  Chat.findOneAndUpdate(
    { "bothSide.user": id, messageId },
    { $set: { "bothSide.$.lastId": readId } },
    function(error, result) {
      if (error || !result) {
        return res.json({ code: 1 });
      }
      return res.json({ code: 0 });
    }
  );
});

module.exports = Router;
