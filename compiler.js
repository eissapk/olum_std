const sass = require("sass");
const pug = require("pug");
const fs = require("fs");
const extra = require("fs-extra");
const path = require("path");
const colors = require("colors");
const htmlVarRegex = /(?<=html`)[^`]+(?=`)/; // detect content in template literal with html tag => html`content`
const styleVarRegex = /(?<=css`)[^`]+(?=`)/; // detect content in template literal with css tag => css`content`
const [base, sub] = ["src", "pre-build"];
const dirs = [`${sub}/components`, `${sub}/views`];
const settings = require("./settings");

const updateFiles = (dir, file) => {
  fs.readFile(path.join(__dirname, dir, file), "utf8", (err, data) => {
    if (err) return console.error(colors.red.bold(err));

    // extract pug & scss
    const html = settings.pug && data.match(htmlVarRegex).length ? data.match(htmlVarRegex)[0] : null;
    const style = settings.sass && data.match(styleVarRegex).length ? data.match(styleVarRegex)[0] : null;

    // complied pug & scss
    const compiledHTML = html != null ? pug.render(html) : html;
    const compiledStyle = style != null ? sass.renderSync({ data: style }).css.toString() : style;

    // console.log("original style => ", style);
    // console.log("compiled style => ", compiledStyle);
    // console.log("original html => ", html);
    // console.log("compiled html => ", compiledHTML);

    let newFile = data.replace(html, "\n" + compiledHTML + "\n");
    newFile = newFile.replace(style, "\n" + compiledStyle + "\n");

    // update file
    fs.writeFile(path.join(__dirname, dir, file), newFile, err => {
      if (err) return console.error(colors.red.bold(err));
      console.log(colors.blue.bold(`updated => ${dir}/${file}`));
    });
  });
};

const clean = () => {
  return new Promise((resolve, reject) => {
    extra.remove(`./${sub}`, err => {
      if (err) reject(err);
      console.log(colors.green.bold(`Cleaned "${sub}" folder`));
      resolve();
    });
  });
};

const copy = () => {
  return new Promise((resolve, reject) => {
    extra.copy(`./${base}`, `./${sub}`, err => {
      if (err) reject(err);
      console.log(colors.green.bold(`Copied "${base}" folder to "${sub}" folder`));
      resolve();
    });
  });
};

const update = () => {
  dirs.forEach(dir => {
    fs.readdir(path.join(__dirname, dir), (err, files) => {
      if (err) return console.error(colors.red.bold(err));
      files.forEach(file => updateFiles(dir, file));
    });
  });
};

const init = async () => {
  try {
    await clean();
    await copy();
    update();
  } catch (err) {
    console.error(colors.red.bold(err));
  }
};

init();
