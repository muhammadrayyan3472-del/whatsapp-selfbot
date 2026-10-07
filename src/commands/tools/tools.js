const { mathFactory, convertFactory, utilityFactory } = require('../../core/factories');

module.exports = [
  // Math & Calculation
  mathFactory("calc", "calc", ["calculate", "math"]),
  mathFactory("pct", "pct", ["percentage"]),
  mathFactory("random", "random", ["rand"]),
  mathFactory("choose", "choose", ["pick"]),
  mathFactory("dice", "dice"),
  mathFactory("coin", "coin", ["coinflip"]),
  mathFactory("roll", "roll"),
  mathFactory("genpass", "genpass", ["password", "pw"]),
  mathFactory("sum", "sum"),
  mathFactory("avg", "avg", ["average"]),
  mathFactory("min", "min"),
  mathFactory("max", "max"),
  mathFactory("add", "add"),
  mathFactory("sub", "sub"),
  mathFactory("mul", "mul", ["multiply"]),
  mathFactory("div", "div", ["divide"]),
  mathFactory("mod", "mod"),
  mathFactory("pow", "pow", ["power"]),
  mathFactory("percent", "percent"),
  mathFactory("abs", "abs"),
  mathFactory("sqrt", "sqrt"),
  mathFactory("floor", "floor"),
  mathFactory("ceil", "ceil"),
  mathFactory("round", "round"),
  mathFactory("sin", "sin"),
  mathFactory("cos", "cos"),
  mathFactory("tan", "tan"),

  // Online & System Utilities
  utilityFactory("weather", "weather", ["forecast"]),
  utilityFactory("wiki", "wiki", ["wikipedia"]),
  utilityFactory("github", "github", ["gh"]),
  utilityFactory("uuid", "uuid"),
  utilityFactory("hash", "hash"),
  utilityFactory("sha1", "sha1"),
  utilityFactory("sha256", "sha256"),
  utilityFactory("sha512", "sha512"),
  utilityFactory("md5", "md5"),
  utilityFactory("base64", "b64", ["b64"]),
  utilityFactory("b64decode", "b64d", ["b64d"]),
  utilityFactory("bytes", "bytes"),
  utilityFactory("iplookup", "ip", ["ip", "dns"]),
  utilityFactory("jsonformat", "json", ["json"]),

  // Unit Conversions - Temperature
  convertFactory("c2f", "c2f", "°F"),
  convertFactory("f2c", "f2c", "°C"),
  convertFactory("c2k", "c2k", "K"),
  convertFactory("k2c", "k2c", "°C"),
  convertFactory("f2k", "f2k", "K"),
  convertFactory("k2f", "k2f", "°F"),

  // Unit Conversions - Distance & Length
  convertFactory("km2mi", "km2mi", "miles"),
  convertFactory("mi2km", "mi2km", "km"),
  convertFactory("m2ft", "m2ft", "ft"),
  convertFactory("ft2m", "ft2m", "m"),

  // Unit Conversions - Weight & Volume
  convertFactory("kg2lb", "kg2lb", "lbs"),
  convertFactory("lb2kg", "lb2kg", "kg"),
  convertFactory("l2gal", "l2gal", "gallons"),
  convertFactory("gal2l", "gal2l", "liters"),

  // Unit Conversions - Speed
  convertFactory("kmh2mph", "kmh2mph", "mph"),
  convertFactory("mph2kmh", "mph2kmh", "km/h"),

  // Unit Conversions - Data Storage
  convertFactory("bytes2kb", "bytes2kb", "KB"),
  convertFactory("kb2mb", "kb2mb", "MB"),
  convertFactory("mb2gb", "mb2gb", "GB"),
  convertFactory("gb2tb", "gb2tb", "TB"),

  // Unit Conversions - Time
  convertFactory("sec2min", "sec2min", "minutes"),
  convertFactory("min2sec", "min2sec", "seconds"),
  convertFactory("min2hr", "min2hr", "hours"),
  convertFactory("hr2min", "hr2min", "minutes"),
  convertFactory("day2hr", "day2hr", "hours"),
  convertFactory("hr2day", "hr2day", "days")
];