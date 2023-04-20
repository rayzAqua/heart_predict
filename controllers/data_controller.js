import Data from "../models/Data";

class DataController{
    async getData(req, res, next){
        try{
            const data = await Data.findById(req.params.id);
            res.status(200).json(data);
        }catch(err){
            next(err);
        }
    }

    async createData(req, res, next){
        const newData = new Data(req.body);
        try{
            const savedData = await newData.save();
            res.status(200).json(savedData);
        }catch(err){
            res.status(500).json(err);
        }
    }

    async getDataByDate(req, res, next){ 
        const {}
        try{
            const dataSet = await Data.find()
        }catch(err){
            next(err);
        }
    }
}

export default new DataController();