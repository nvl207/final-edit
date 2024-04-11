var database = require("../../config/db_connect");



module.exports.getFullBill = (req,res)=>{
    const sql_query = "select * from `order`";
    database.query(sql_query,(err,rows)=>{
        if(err){
            return res.json({msg:err});
        }else{
            return res.json(rows)
        }
    })
}  // done

module.exports.deleteBill = (req, res) => {
    const code_orders = req.params.code_orders; // Lấy mã đơn hàng từ tham số trong URL

    const sql_select_details = "SELECT id_product, quantity, size FROM order_details WHERE id_order = ?";
    database.query(sql_select_details, [code_orders], (err, rows) => {
        if (err) {
            return res.json({ msg: err });
        } else {
            // Cập nhật lại lượng hàng trong kho
            rows.forEach((item) => {
                updateQuantityInventory(item.id_product, item.quantity, item.size);
            });

            // Xóa chi tiết đơn hàng
            const sql_delete_details = "DELETE FROM order_details WHERE id_order = ?";
            database.query(sql_delete_details, [code_orders], (err, result) => {
                if (err) {
                    return res.json({ msg: err });
                } else {
                    // Xóa đơn hàng
                    const sql_delete_order = "DELETE FROM `order` WHERE code_orders = ?";
                    database.query(sql_delete_order, [code_orders], (err, result) => {
                        if (err) {
                            return res.json({ msg: err });
                        } else {
                            return res.json({ msg: "Success" });
                        }
                    });
                }
            });
        }
    });
};
const updateQuantityInventory = (size, idProduct, quantity, res) => {
    const sql = "SELECT `sold` FROM `inventory` WHERE id_product = ? AND size = ?";
    database.query(sql, [idProduct, size], (err, rows) => {
        if (err) {
            return res.json({ msg: err });
        } else {
            const newSold = rows[0].sold - quantity;
            const update = "UPDATE `inventory` SET `sold` = ? WHERE id_product = ? AND size = ?";
            database.query(update, [newSold, idProduct, size], (err, result) => {
                if (err) {
                    return res.json({ msg: err });
                } else {
                    // Return success message or handle further operations if needed
                }
            });
        }
    });
};



