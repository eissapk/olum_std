import shell from "shelljs";
import notify from "./notifier";
import logger from "./logger";
import reload from "./reload";

export const bundleDev = () => {
  const taskName = "bundle";
  return new Promise((resolve, reject) => {
    try {
      logger(taskName, "start");
      shell.exec("webpack --env dev");
      logger(taskName, "end");
      notify(taskName);
      reload();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const bundleBuild = () => {
  const taskName = "bundle";
  return new Promise((resolve, reject) => {
    try {
      logger(taskName, "start");
      shell.exec("webpack");
      logger(taskName, "end");
      notify(taskName);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
