import shell from "shelljs";
import notify from "./notifier";
import logger from "./logger";

const compile = () => {
  const taskName = "compile";
  return new Promise((resolve, reject) => {
    try {
      logger(taskName, "start");
      shell.exec("node compiler.js compile");
      logger(taskName, "end");
      notify(taskName);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export default compile;