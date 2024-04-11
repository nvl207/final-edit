var database = require("../config/db_connect");


module.exports.getReviewById = (req, res) => {
    const { id } = req.params; 
    const sql_query = "SELECT * FROM review WHERE id_review = ?";
    database.query(sql_query, [id], (err, rows) => {
        if (err) {
            return res.json({ msg: err });
        } else {
            return res.json(rows);
        }
    });
};


module.exports.addReview = (req, res) => {
    const { id_account, id_product, comment, evaluate } = req.body;
    const sql_query = "INSERT INTO review (id_account, id_product, comment, evaluate, status) VALUES (?, ?, ?, ?, ?)";
    database.query(sql_query, [id_account, id_product, comment, evaluate, 1], (err, result) => {
        if (err) {
            return res.json({ msg: err });
        } else {
            return res.json({ msg: "Success" });
        }
    }); // done
};

module.exports.editReview = (req, res) => {
    const { id, comment } = req.body;
    const sql_query = "UPDATE review SET comment = ? WHERE id_review = ?";
    database.query(sql_query, [comment, id], (err, result) => {
        if (err) {
            return res.json({ msg: err });
        } else {
            return res.json({ msg: "Success" });
        }
    });
};





