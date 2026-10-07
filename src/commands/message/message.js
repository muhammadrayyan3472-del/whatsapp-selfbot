const { messageFactory } = require('../../core/factories');

module.exports = [
  messageFactory("snipe", "snipe", ["sniped"]),
  messageFactory("snipeall", "snipeall"),
  messageFactory("quote", "quote"),
  messageFactory("quotedid", "quotedid"),
  messageFactory("quotedauthor", "quotedauthor"),
  messageFactory("quotedtype", "quotedtype"),
  messageFactory("quotedbody", "quotedbody"),
  messageFactory("react", "react"),
  messageFactory("star", "star"),
  messageFactory("unstar", "unstar"),
  messageFactory("delete", "delete", ["delmsg"]),
  messageFactory("forward", "forward"),
  messageFactory("messageid", "messageid", ["msgid"]),
  messageFactory("type", "type"),
  messageFactory("author", "author"),
  messageFactory("bodylength", "bodylength"),
  messageFactory("wordcount", "wordcount"),
  messageFactory("charcount", "charcount"),
  messageFactory("messagetime", "messagetime"),
  messageFactory("isstarred", "isstarred"),
  messageFactory("hasmedia", "hasmedia"),
  messageFactory("copy", "copy", ["repeatmsg"]),
  messageFactory("mentionme", "mentionme")
];