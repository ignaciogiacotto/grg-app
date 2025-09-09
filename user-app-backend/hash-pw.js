const bcrypt = require("bcrypt");
const saltRounds = 10;
const plainPassword = "admin";

bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
  if (err) {
    throw err;
  }
  console.log(hash);
});
