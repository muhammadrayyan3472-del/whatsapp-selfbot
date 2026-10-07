const { funFactory } = require('../../core/factories');

module.exports = [
  funFactory("8ball", "8ball", ["eightball"]),
  funFactory("joke", "joke", ["meme"]),
  funFactory("quoteoftheday", "quote", ["qotd", "quote"]),
  funFactory("compliment", "compliment"),
  funFactory("roast", "roast"),
  funFactory("riddle", "riddle"),
  funFactory("rate", "rate"),
  funFactory("yesno", "yesno"),
  funFactory("randomemoji", "emoji"),
  funFactory("randomfact", "fact"),
  funFactory("wyr", "wyr", ["wouldyourather"]),
  funFactory("rps", "rps", ["rockpaperscissors"]),
  funFactory("dicegame", "dicegame", ["rolldice"]),
  funFactory("love", "love", ["ship", "compatibility"]),
  funFactory("randomnumber", "randomnumber", ["randnum"]),
  funFactory("randomletter", "randomletter"),
  funFactory("randomname", "randomname"),
  funFactory("mood", "mood"),
  funFactory("randomtime", "randomtime"),
  funFactory("randomdate", "randomdate"),
  funFactory("clap", "clap"),
  funFactory("boom", "boom"),
  funFactory("party", "party"),
  funFactory("ascii", "ascii", ["art", "emoticon"])
];