const extra = require("fs-extra");
const colors = require("colors");
const settings = require("./settings");

extra.remove(`./${settings.src}`, err => {
  if (err) return console.error(colors.red.bold(err));
  console.log(colors.green.bold(`Cleaned "${settings.src}" folder`));
});
