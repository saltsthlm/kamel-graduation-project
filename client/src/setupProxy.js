const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(
    proxy("/socket/", {
      target: "ws://localhost:8888",
      ws: true
    }),
    proxy("/login", {
      target: "http://localhost:8888",
    })
  );
};