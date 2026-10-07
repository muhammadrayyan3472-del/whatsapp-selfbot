const { accountFactory } = require('../../core/factories');

module.exports = [
  accountFactory("me", "me", ["whoami"]),
  accountFactory("myname", "name", ["displayname"]),
  accountFactory("mybio", "bio", ["bio", "about"]),
  accountFactory("myprofilepic", "profile", ["pp", "pic", "avatar"]),
  accountFactory("setname", "setname"),
  accountFactory("setbio", "setbio"),
  accountFactory("battery", "battery"),
  accountFactory("device", "device"),
  accountFactory("number", "number", ["phone", "mynumber"]),
  accountFactory("block", "block"),
  accountFactory("unblock", "unblock"),
  accountFactory("business", "business", ["isbusiness"]),
  accountFactory("verified", "verified", ["isverified"]),
  accountFactory("accountinfo", "accountinfo", ["accinfo"]),
  accountFactory("contactinfo", "contactinfo", ["cinfo", "userinfo"]),
  accountFactory("logout", "logout")
];