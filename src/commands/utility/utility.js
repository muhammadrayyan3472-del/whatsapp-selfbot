const { utilityFactory } = require('../../core/factories');

module.exports = [
  utilityFactory("note", "note", ["addnote"]),
  utilityFactory("notes", "notes", ["listnotes"]),
  utilityFactory("findnote", "findnote", ["searchnote"]),
  utilityFactory("delnote", "delnote", ["rmnote"]),
  utilityFactory("clearnotes", "clearnotes"),

  utilityFactory("todo", "todo", ["addtodo"]),
  utilityFactory("todos", "todos", ["listtodo"]),
  utilityFactory("donetodo", "donetodo"),
  utilityFactory("deltodo", "deltodo"),
  utilityFactory("cleartodos", "cleartodos"),

  utilityFactory("remind", "remind", ["reminder"]),
  utilityFactory("schedule", "schedule", ["timer"]),
  utilityFactory("afk", "afk"),
  utilityFactory("unafk", "unafk"),

  utilityFactory("poll", "poll"),
  utilityFactory("crypto", "crypto", ["coinprice"]),
  utilityFactory("btc", "crypto", ["bitcoin"]),
  utilityFactory("eth", "crypto", ["ethereum"]),
  utilityFactory("sol", "crypto", ["solana"]),

  utilityFactory("settings", "settings"),
  utilityFactory("setsetting", "setsetting"),
  utilityFactory("getsetting", "getsetting"),
  utilityFactory("delsetting", "delsetting"),

  utilityFactory("today", "today"),
  utilityFactory("tomorrow", "tomorrow"),
  utilityFactory("yesterday", "yesterday"),
  utilityFactory("month", "month"),
  utilityFactory("year", "year"),
  utilityFactory("daysleft", "daysleft"),

  utilityFactory("timestamp", "timestamp", ["unixtime"]),
  utilityFactory("randomcolor", "randomcolor", ["hexcolor"])
];