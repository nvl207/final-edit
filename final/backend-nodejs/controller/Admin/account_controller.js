var database = require("../../config/db_connect");


// get account
module.exports.getFullAccount = (req, res) => {
    const sql = "SELECT * FROM account";
    database.query(sql, (err, result) => {
        if (err) {
            return res.json({ msg: err });
        } else {
            return res.json(result);
        }
    });  // ok
};


// update account
module.exports.updateAccountRole = (req, res) => {
  const { id_account, role_id } = req.body;
  const sql = `
    UPDATE account 
    SET id_role = ?
    WHERE id_account = ?`;
  database.query(sql, [role_id, id_account], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: err });
    } else {
      if (result.affectedRows > 0) {
          return res.json({ msg: "Cập nhật vai trò của tài khoản thành công" });
      } else {
          return res.status(404).json({ msg: "Không tìm thấy tài khoản để cập nhật" });
      }
    }
  });
};

