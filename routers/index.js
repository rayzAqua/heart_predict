import authRouter from "./auth.routes.js";

function hieu56(app) {
  //viet route trong nay
  app.use("/account", authRouter);
}
function hieu57(app) {
  //viet route trong nay
}
function hoa(app) {
  //viet route trong nay
}

function route(app) {
  hieu56(app);
  hieu57(app);
  hoa(app);

  //API chung
  //   app.use("/site", siteRouter);
  app.use("/", (req, res) => {
    res.send("Hello");
  });
}

// module.exports = route;
export default route;
