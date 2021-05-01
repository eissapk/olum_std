module.exports = {
  dest: "build",
  src: ".pre-build",
  port: 8000,
  livereload: true,
  fallback: "/",
  comments: false,
  hash: 10,
  title: "My Note",
  asyncAwait: false,
  https: false,
  favicon:"./public/favicon.png",
  template: "./public/index.html",
  isDebugging: false,
  notifyMsg: "<taskName> task is done",
  notifyTitle: "Pkjs Notification"
};