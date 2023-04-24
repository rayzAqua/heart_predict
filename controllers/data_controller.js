import Data from "../models/Data";

class DataControllers{
    async createData(req, res, next){
        const newData = new Data(req.body);
        try{
            const savedData = await newData.save();
            res.status(200).json(savedData);
        }catch(err){
            return res.status(200).json({
                status: false,
                message: err.message,
                data: { err },
              });
        }
    }

    async getLatestData(req, res, next){
        try{
            const data = await Data.findOne({userInfo: req.params.id})
            res.status(200).json(data);
        }catch(err){
            return res.status(200).json({
                status: false,
                message: err.message,
                data: { err },
              });
        }
    }
}
export default new DataControllers();

