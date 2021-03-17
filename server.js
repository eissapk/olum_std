const express = require("express");
const path = require("path");
const server = express();

// middleware
server.use(express.static(path.join(__dirname, "dist")));

// catch all routes
server.get("/*", async (req, res) => res.sendFile(path.resolve(__dirname, "dist", "index.html")));

// listen 
const port = process.env.PORT || 8080;
server.listen(port, () => console.log("http://localhost:" + port));
