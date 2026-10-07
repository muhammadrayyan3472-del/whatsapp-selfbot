const { chatFactory } = require('../../core/factories');

module.exports = [
  chatFactory("chatinfo", "info", ["cinfo"]),
  chatFactory("archive", "archive"),
  chatFactory("unarchive", "unarchive"),
  chatFactory("mute", "mute"),
  chatFactory("unmute", "unmute"),
  chatFactory("pin", "pin"),
  chatFactory("unpin", "unpin"),
  chatFactory("markread", "read", ["read", "seen", "markseen"]),
  chatFactory("markunread", "unread"),
  chatFactory("clearchat", "clear", ["clear"]),
  chatFactory("last", "last", ["lastmsg"]),
  chatFactory("history", "history", ["messages"]),
  chatFactory("fetchmessages", "fetch", ["fetch"]),
  chatFactory("chatid", "id", ["cid"]),
  chatFactory("chatname", "name"),
  chatFactory("isgroup", "isgroup"),
  chatFactory("unreadcount", "unreadcount"),
  chatFactory("chatarchived", "archived", ["isarchived"]),
  chatFactory("chatpinned", "pinned", ["ispinned"]),
  chatFactory("chatmuted", "muted", ["ismuted"]),
  chatFactory("sendtext", "sendtext", ["sendmsg"]),
  chatFactory("listchats", "listchats", ["chats"]),
  chatFactory("groups", "groups", ["grouplist"]),
  chatFactory("privatechats", "privatechats", ["dms"]),
  chatFactory("chatcontact", "contact", ["directcontact"])
];