import path from "path";
import fs from "fs";
import notify from "gulp-notify";

const notification = fn => {
  const name = fn.name;
  const icon = path.resolve(__dirname, "../public/logo.png");
  const obj = {
    message: name + " task is done",
    title: "Pkjs Notification",
    icon: fs.existsSync(icon) ? icon : null
  };
  return notify(obj);
};

export default notification;