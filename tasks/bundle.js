import shell from "shelljs";
import logger from "./logger";
import reload from "./reload";

export const bundleDev = () => {
  const taskName = "bundle";
  return new Promise((resolve, reject) => {
    try {
      logger(taskName, "start");
      shell.exec("webpack --env dev");
      logger(taskName, "end");
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
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
