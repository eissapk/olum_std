import compile from "./compile";
import { bundleDev, bundleBuild } from "./bundle";
import watch from "./watch";
import server from "./server";
import clean from "./clean";
import colors from "colors";

async function renderDev() {
  try {
    await compile();
    await bundleDev();
    await server();
    watch();
  } catch (err) {
    console.log(colors.red.bold(err));
  }
}

async function renderBuild() {
  try {
    await compile();
    await bundleBuild();
    await clean();
    // process.exit(0);
  } catch (err) {
    console.log(colors.red.bold(err));
  }
}

export const dev = renderDev;
export const build = renderBuild;
