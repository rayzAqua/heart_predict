import Data from "../models/Data.js";

class DataControllers {
  async createData(req, res) {
    const newData = new Data(req.body);
    try {
      const savedData = await newData.save();
      res.status(200).json(savedData);
    } catch (err) {
      return res.json({
        success: false,
        status: err.status,
        message: err.message,
        stack: err.stack,
      });
    }
  }

  async getLatestData(req, res) {
    try {
      const data = await Data.findOne({ userInfo: req.params.id });
      res.status(200).json(data);
    } catch (err) {
      return res.json({
        success: false,
        status: err.status,
        message: err.message,
        stack: err.stack,
      });
    }
  }
}

export default new DataControllers();
