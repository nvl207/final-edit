var database = require("../../config/db_connect");

module.exports.getPromotion = (req,res)=>{
    const sql_query = "select * from sale "
    database.query(sql_query, (err,result)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(result)
        }
    }) // ok
} 


// update time sale
module.exports.updateTimeSale = (req, res) => {
const {id, date_start, date_end} = req.body;
const sql_query = "update `sale` set date_start= ?, date_end = ? where id_sale = ? ";
 database.query(sql_query, [date_start, date_end, id], (err,rows)=>{
    if(err){
        return res.json({msg:err});
    }else{
        return res.json({msg:"Success"})
    } // done
})
}

//update quantity sale

// add promotion
module.exports.addPromotion = (req, res) => {
    const { name_sale, code_sale, cost_sale, quantity, date_start, date_end, status } = req.body.data;
    console.log("=====", req.body.data);
    const sql = "INSERT INTO sale(name_sale, code_sale, cost_sale, quantity, date_start, date_end, status, used) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    database.query(sql, [name_sale, code_sale.toUpperCase(), cost_sale, quantity, date_start, date_end, status, 0], (err, result) => {
        if (err) {
            return res.json({ msg: err });
        } else {
            return res.json({ msg: "Success" });
        }
    });
};

// delete sale


module.exports.deleteSale = (req, res) => {
    const { id } = req.body;
    const sql = "DELETE FROM sale WHERE id_sale = ?";
    database.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.json({ msg: err });
        } else {
            return res.json({ msg: "Success" });
        }
    });
};
