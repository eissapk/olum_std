import shell from "shelljs";
import notify from "./notifier";
import logger from "./logger";

const clean = () => {
  const taskName = "clean";
  return new Promise((resolve, reject) => {
    try {
      logger(taskName, "start");
      shell.exec("node compiler.js clean");
      logger(taskName, "end");
      notify(taskName);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export default clean;