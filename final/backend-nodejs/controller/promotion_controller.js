var database = require("../config/db_connect");

module.exports.getSaleByCode = (req,res)=>{
    const {code} = req.body;
    const sql = "select  * from sale WHERE code_sale = ?";
    database.query(sql,[code],(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }
        if(rows.length<1){
            return res.json({
                msg:"Sale not exist"
            })
        }
        else{
            return res.json(rows)
        }
    })
}