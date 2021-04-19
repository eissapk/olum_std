#!/usr/bin/env node
const commander = require("commander");
const cmd = new commander.Command();
const sass = require("sass");
const fs = require("fs");
const extra = require("fs-extra");
const path = require("path");
const colors = require("colors");
const settings = require("./settings");

class Compiler {
  sub = settings.src;
  mainDirs = ["components", "views"];
  dirs = [];
  regex = {
    template: {
      all: /<template[\s\S]*?>[\s\S]*?<\/template>/gi,
      tag: /<template[\s\S]*?>|<\/template>/gi,
    },
    script: {
      all: /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      tag: /<script[\s\S]*?>|<\/script>/gi,
      curlyAfterClass: /(?<=export.*class.*)(\{)/,
    },
    style: {
      all: /<style[\s\S]*?>[\s\S]*?<\/style>/gi,
      tag: /<style[\s\S]*?>|<\/style>/gi,
      openTag: /<style[\s\S]*?>/gi,
    },
  };

  dirsRegex(arr) {
    const pattern = arr
      .map(dir => `${dir.toLowerCase().trim()}|`)
      .join("")
      .slice(0, -1);
    const regex = new RegExp(pattern, "gi");
    return regex;
  }

  compsDirs() {
    const dirs = src => {
      return fs
        .readdirSync(src)
        .map(item => path.join(src, item))
        .filter(item => fs.statSync(item).isDirectory());
    };
    const recursive = src => [src, ...this.flatten(dirs(src).map(recursive))];
    let arr = recursive("src");

    arr = arr
      .filter(item => {
        const regex = this.dirsRegex(this.mainDirs);
        const result = regex.test(item);
        if (result) return item;
      })
      .map(item => item.replace(/^src/, this.sub));

    this.dirs = arr; // update
  }

  flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
  }

  constructor() {
    this.compsDirs(); // get all directories paths in components & views

    cmd.command("clean").action(this.clean.bind(this));
    cmd.command("compile").action(this.init.bind(this));
    cmd.parse(process.argv);
  }

  html(file) {
    const tempArr = file.match(this.regex.template.all);
    const template = Array.isArray(tempArr) && tempArr.length ? tempArr[0] : "";
    const markup = template.replace(this.regex.template.tag, "");
    return "\n template() { \n return `" + markup + "`;\n}\n";
  }

  hasSASS(style) {
    const regex = new RegExp("lang=['\"]scss|sass['\"]", "gi");
    const openTagArr = style.match(this.regex.style.openTag);
    const openTag = Array.isArray(openTagArr) && openTagArr.length ? openTagArr[0] : "";
    return regex.test(openTag);
  }

  css(file, shared) {
    const styleArr = file.match(this.regex.style.all);
    let style = Array.isArray(styleArr) && styleArr.length ? styleArr[styleArr.length - 1] : ""; // get last style tag as the order of the component file cause you may have style tag inside the class "script tag"
    const scss = style.replace(this.regex.style.tag, "");
    const compiledShared = sass.renderSync({ data: shared }).css.toString();
    const css = this.hasSASS(style) ? sass.renderSync({ data: shared + scss }).css.toString() : compiledShared + scss;
    return "\n style() { \n return `" + css + "`;\n}\n";
  }

  js(file) {
    const scriptArr = file.match(this.regex.script.all);
    let script = Array.isArray(scriptArr) && scriptArr.length ? scriptArr[0] : "";
    return script.replace(this.regex.script.tag, "");
  }

  fileName(file) {
    const arr = file.split(".");
    const extension = arr[arr.length - 1];
    return file.replace(extension, "") + "js";
  }

  createFile(dir, fileName, compiledFile) {
    fs.writeFile(path.resolve(__dirname, dir, fileName), compiledFile, err => {
      if (err) return console.error(colors.red.bold(err));
      console.log(colors.blue.bold(`Created: "${fileName}"`));
    });
  }

  removeFile(dir, file) {
    extra.remove(path.resolve(__dirname, dir, file), err => {
      if (err) return console.error(colors.red.bold(err));
      console.log(colors.yellow.bold(`Removed "${file}"`));
    });
  }

  compile(dir, file, shared) {
    fs.readFile(path.resolve(__dirname, dir, file), "utf8", (err, data) => {
      if (err) return console.error(colors.red.bold(err));

      const html = this.html(data);
      const css = this.css(data, shared);
      const js = this.js(data);
      const compiledFile = js.replace(this.regex.script.curlyAfterClass, "{" + html + css);

      const fileName = this.fileName(file);
      this.createFile(dir, fileName, compiledFile);
      this.removeFile(dir, file);
    });
  }

  clean() {
    return new Promise((resolve, reject) => {
      extra.remove(path.resolve(__dirname, this.sub), err => {
        if (err) reject(err);
        console.log(colors.yellow.bold(`Removed "${this.sub}" directory`));
        resolve();
      });
    });
  }

  copy() {
    return new Promise((resolve, reject) => {
      extra.copy(path.resolve(__dirname, "src"), path.resolve(__dirname, this.sub), err => {
        if (err) reject(err);
        console.log(colors.green.bold('Cloned "src" directory'));
        resolve();
      });
    });
  }

  sharedStyle() {
    const file = path.resolve(__dirname, "src/styles/shared.scss");
    return new Promise((resolve, reject) => {
      if (fs.existsSync(file)) {
        fs.readFile(file, "utf8", (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
      } else {
        resolve("");
      }
    });
  }

  update(shared = "") {
    this.dirs.forEach(dir => {
      fs.readdir(path.resolve(__dirname, dir), (err, files) => {
        if (err) return console.error(colors.red.bold(err));

        files.forEach(file => {
          const item = path.join(dir, file);
          // get files only and exclude directories
          if (!fs.statSync(item).isDirectory()) this.compile(dir, file, shared);
        });
      });
    });
  }

  async init() {
    try {
      await this.clean();
      await this.copy();
      const shared = await this.sharedStyle();
      this.update(shared);
    } catch (err) {
      console.error(colors.red.bold(err));
    }
  }
}

new Compiler();
