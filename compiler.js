const sass = require("sass");
const pug = require("pug");
const fs = require("fs");
const extra = require("fs-extra");
const path = require("path");
const colors = require("colors");
const htmlVarRegex = /(?<=html`)[^`]+(?=`)/; // detect content in template literal with html tag => html`content`
const styleVarRegex = /(?<=css`)[^`]+(?=`)/; // detect content in template literal with css tag => css`content`
const newRegex = {
  template: {
    all: /<template[\s\S]*?>[\s\S]*?<\/template>/gi,
    tag: /<template[\s\S]*?>|<\/template>/gi,
  },
  script: {
    all: /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    tag: /<script[\s\S]*?>|<\/script>/gi,
  },
  style: {
    all: /<style[\s\S]*?>[\s\S]*?<\/style>/gi,
    tag: /<style[\s\S]*?>|<\/style>/gi,
  },
};
const [base, sub] = ["src", "pre-build"];
const dirs = [`${sub}/components`, `${sub}/views`];
const settings = require("./settings");

const compiler = (dir, file) => {
  fs.readFile(path.join(__dirname, dir, file), "utf8", (err, data) => {
    if (err) return console.error(colors.red.bold(err));

    let sourceFile = data;
    let template = Array.isArray(sourceFile.match(newRegex.template.all)) && sourceFile.match(newRegex.template.all).length ? sourceFile.match(newRegex.template.all)[0] : null;
    let script = Array.isArray(sourceFile.match(newRegex.script.all)) && sourceFile.match(newRegex.script.all).length ? sourceFile.match(newRegex.script.all)[0] : null;
    let style = Array.isArray(sourceFile.match(newRegex.style.all)) && sourceFile.match(newRegex.style.all).length ? sourceFile.match(newRegex.style.all)[0] : null;

    if (template != null) {
      const markup = template.replace(newRegex.template.tag, "");
      // const compiledHTML = pug.render(markup);
      sourceFile = sourceFile.replace(template, "let template = " + "`" + markup + "`;");
    }

    if (style != null) {
      const scss = style.replace(newRegex.style.tag, "");
      const compiledStyle = sass.renderSync({ data: scss }).css.toString();
      sourceFile = sourceFile.replace(style, "let style = " + "`" + compiledStyle + "`;");
    }

    if (script != null) {
      const js = script.replace(newRegex.script.tag, "");
      sourceFile = js + "\n" + sourceFile.replace(script, ""); // append js to top of file
    }
    let arr = file.split(".");
    const fileExt = arr[arr.length - 1];
    const fileName = file.replace(fileExt, "");

    // update file
    fs.writeFile(path.join(__dirname, dir, `${fileName}js`), sourceFile, err => {
      if (err) return console.error(colors.red.bold(err));
      console.log(colors.blue.bold(`updated => ${dir}/${file}`));
    });

    // remove old file
    extra.remove(path.join(__dirname, dir, file), err => {
      if (err) console.error(err);
      console.log(colors.green.bold(`Cleaned "${file}"`));
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
      files.forEach(file => compiler(dir, file));
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
