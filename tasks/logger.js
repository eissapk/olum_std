import colors from "colors";

const logger = (name, status) => {
  const t = new Date();
  const h = t.getHours();
  const m = t.getMinutes();
  const s = t.getSeconds();

  const start = `[${h}:${m}:${s}] Starting '${name}'...`;
  const end = `[${h}:${m}:${s}] Finished '${name}'...`;

  if (status === "start") {
    console.log(colors.yellow(start));
  } else if (status === "end") {
    console.log(colors.yellow(end));
  }
};

export default logger;
