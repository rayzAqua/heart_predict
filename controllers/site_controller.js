const message = require("../utils/message");
const { getListAddress } = require("../utils/address");
var Status = require("../models/status_model");
var Tour = require("../models/tour_model");
const connection = require("../utils/connection");

class SiteControllers {
  index(req, res) {
    return res.send(message({ data: "Hello world" }));
  }
}
module.exports = new SiteControllers();
