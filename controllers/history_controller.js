import Account from "../models/Account.js";
import Data from "../models/Data.js";
import * as tf from '@tensorflow/tfjs'
class HistoryController {
  async getHistory(req, res, next) {
    const user = JSON.parse(req.user);
    const data = await Data.findOne({ userInfo: user._id });
    res.status(200).json({
      status: true,
      message: "Thành công",
      data: data,
    })
  }
  async createHistory(req, res) {
    const user = JSON.parse(req.user);
    const { heart, spO2 } = req.body;
    var date = new Date();
    const data = await Data.findOne({ userInfo: user._id });
    if (data == null) {
      const acccount = await Data.create({
        userInfo: user,
        heart: [{ heartRate: heart, date: date }],
        spO2: [{ oxygen: spO2, date: date }]
      })
    }
    else {
      Data.updateOne({ userInfo: user._id },
        {
          heart: [...data.heart, { heartRate: heart, date: date }],
          spO2: [...data.spO2, { oxygen: spO2, date: date }]
        }).catch(err =>res.status(200).json({
          status: 'fail',
          message: "Có lỗi xảy ra",
          data: {},
        })
        )
    }
    res.status(200).json({
      status: true,
      message: "Thành công",
      data: {},
    })
  }
  async testPredict(req,res,next){
    const model = await tf.loadGraphModel('../heart_predict/my_model/my_model')
    res.send({status:'ioj'})
  }
}

export default new HistoryController();