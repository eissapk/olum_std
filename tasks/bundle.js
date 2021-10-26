import { exec } from "child_process";
import logger from "./logger";
import reload from "./reload";

const bundle = mode => {
  const taskName = "bundle";
  return new Promise((resolve, reject) => {
    logger(taskName, "start");
    if (mode === "development") {
      exec("webpack --env dev", (error, stdout, stderr) => {
        if (error) return reject(error);
        if (stderr.trim() !== "") return reject(stderr);
        if (stdout !== "webpack compiled successfully\n") console.log(stdout);
        resolve();
        reload();
        logger(taskName, "end");
      });
    } else if (mode === "production") {
      exec("webpack", (error, stdout, stderr) => {
        if (error) return reject(error);
        if (stderr.trim() !== "") return reject(stderr);
        if (stdout !== "webpack compiled successfully\n") console.log(stdout);
        resolve();
        logger(taskName, "end");
      });
    }
  });
};

export default bundle;
