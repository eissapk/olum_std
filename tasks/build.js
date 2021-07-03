import { compileBuild } from "./compile";
import { bundleBuild } from "./bundle";
import clean from "./clean";
import colors from "colors";

export default async function renderBuild() {
  try {
    await compileBuild();
    await bundleBuild();
    await clean();
    process.exit(0);
  } catch (err) {
    console.log(colors.red.bold(err));
  }
}