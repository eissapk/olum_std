import { compileDev } from "./compile";
import { bundleDev } from "./bundle";
import watch from "./watch";
import server from "./server";
import colors from "colors";

export default async function renderDev() {
  try {
    await compileDev();
    await bundleDev();
    await watch();
    await server();
  } catch (err) {
    console.log(colors.red.bold(err));
  }
}