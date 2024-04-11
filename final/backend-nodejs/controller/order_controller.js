var database = require("../config/db_connect");

module.exports.getProductByCart = (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.json([]); // Trả về một mảng rỗng nếu không có dữ liệu
    }
    const productIds = data.map((item) => item.id); // Lấy ra các id sản phẩm từ dữ liệu
    const placeholders = productIds.map(() => "?").join(","); // Tạo placeholder cho mỗi id sản phẩm
    const sql_query = `SELECT * FROM product WHERE id_product IN (${placeholders})`;
    database.query(sql_query, productIds, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const products = rows.map((row) => ({
        ...row,
        status: false, // Thêm trường status với giá trị mặc định false
      }));
      // Thêm thông tin số lượng và kích thước vào mỗi sản phẩm
      const result = products.map((product, index) => ({
        ...product,
        quantity: data[index].quantity,
        size: data[index].size,
      }));
      return res.json(result); // Trả về mảng các sản phẩm
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Invalid JSON data" });
  }
}; // done

// sp duoc review
// đang lỗi

//
// module.exports.getBillByIdAccount = (req, res) => {
//   const { id } = req.body;
//   const sql_query = "select * from `order` where id_account =? "	
//   database.query(sql_query, [id], (err, rows) => {
//     if (err) {
//       return res.json({ msg: err });
//     } else {
//       return res.json(rows);
//     }
//   });
// };
