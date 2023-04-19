
function getHistory(req,res,next){   
    console.log(req.user)
    res.send({mess:'ok'})
}
export default getHistory;