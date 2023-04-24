import authRouter from "./auth.routes.js";
import dataRouter from "./data.routes.js";
import historyRouter from "./history.routes.js";

function hieu56(app) {
  //viet route trong nay
  app.use("/account", authRouter);
}
function hieu57(app) {
  //viet route trong nay
}
function hoa(app) {
  //viet route trong nay
  app.use("/data", dataRouter);
}
function manh(app){
  app.use("/history",historyRouter)
}
function route(app) {
  hieu56(app);
  hieu57(app);
  hoa(app);
  manh(app)
  //API chung
  //   app.use("/site", siteRouter);
  app.use("/", (req, res) => {
    res.send("Hello");
  });
}

// module.exports = route;
export default route;
