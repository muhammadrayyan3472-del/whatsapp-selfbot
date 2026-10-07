const { mediaFactory } = require('../../core/factories');

module.exports = [
  mediaFactory("mediainfo", "info", ["mediaabout"]),
  mediaFactory("mediatype", "type"),
  mediaFactory("mimetype", "mimetype"),
  mediaFactory("filename", "filename"),
  mediaFactory("hasmedia", "hasmedia"),
  mediaFactory("downloadmedia", "save", ["download", "savemedia", "save"]),
  mediaFactory("sticker", "sticker", ["s", "stickerify"]),
  mediaFactory("sendfile", "sendfile"),
  mediaFactory("sendimage", "sendimage"),
  mediaFactory("sendvideo", "sendvideo"),
  mediaFactory("sendaudio", "sendaudio"),
  mediaFactory("senddocument", "senddocument"),
  mediaFactory("mediafolder", "mediafolder", ["downloads"]),
  mediaFactory("mediaid", "mediaid"),
  mediaFactory("mediaauthor", "mediaauthor"),
  mediaFactory("clearmedia", "clearmedia", ["cleardownloads"])
];