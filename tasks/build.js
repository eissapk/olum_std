import compile from "./compile";
import bundle from "./bundle";
import clean from "./clean";
import colors from "colors";

export default async function renderBuild() {
  try {
    await compile("production");
    await bundle("production");
    await clean();
    process.exit(0);
  } catch (err) {
    console.log(colors.red.bold(err));
  }
}