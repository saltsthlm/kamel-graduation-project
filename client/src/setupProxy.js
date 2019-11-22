const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  console.log("Setup proxy is ever called");
  app.use(
    proxy("/socket/", {
      target: "ws://localhost:8080",
      ws: true
    }),
    proxy("/login", {
      target: "http://localhost:8080",
    })
  );
};