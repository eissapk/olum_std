import { exec } from "child_process";
import logger from "./logger";
import reload from "./reload";
import colors from "colors";

const bundle = mode => {
  const taskName = "bundle";
  return new Promise((resolve, reject) => {
    logger(taskName, "start");
    if (mode === "development") {
      exec("webpack --env dev", (error, stdout, stderr) => {
        // if (stderr) return reject();
        reload();
        console.log(colors.red.bold(stdout));
        resolve();
        logger(taskName, "end");
      });
    } else if (mode === "production") {
      exec("webpack", (error, stdout, stderr) => {
        // if (stderr) return reject();
        console.log(colors.red.bold(stdout));
        resolve();
        logger(taskName, "end");
      });
    }
  });
};

export default bundle;
