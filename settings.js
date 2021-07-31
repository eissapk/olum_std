module.exports = {
  dest: "build",
  src: ".pre-build",
  port: 8000,
  livereload: true,
  fallback: "/",
  comments: false,
  hash: 5,
  title: "My Note",
  asyncAwait: false,
  https: false,
  favicon: "./public/favicon.png",
  template: "./public/index.html",
  serviceWorker: false,
  manifest: {
    name: "My Note",
    short_name: "My Note",
    description: "My Note",
    background_color: "#ffffff",
    crossorigin: "use-credentials", //can be null, use-credentials or anonymous
    publicPath: "./",
    display: "fullscreen",
    orientation: "landscape",
    theme_color: "aliceblue",
    icons: [
      {
        src: "./public/favicon.png",
        sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
      },
    ],
  },
};