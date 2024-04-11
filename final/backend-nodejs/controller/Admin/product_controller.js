var database = require("../../config/db_connect");

module.exports.addProduct = (req, res) => {
  const {
    name,
    price,
    description,
    image,
    img_des_1,
    img_des_2,
    img_des_3,
    img_des_4,
    id_category,
  } = req.body;
  const sqlAdd =
    "INSERT INTO product (name, price, description,  status, image, img_des_1, img_des_2, img_des_3, img_des_4, id_category) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)";
  database.query(
    sqlAdd,
    [
      name,
      price,
      description,
     
      image,
      img_des_1,
      img_des_2,
      img_des_3,
      img_des_4,
      id_category,
    ],
    (err, rows) => {
      if (err) {
        return res.json({ msg: err });
      } else {
        return res.json({ msg: "Success" });
      }
    }
  );
};

// edit product
module.exports.editProduct = (req, res) => {
  const {
    id,
    name,
    price,
    description,
    promotional,
    image,
    img_des_1,
    img_des_2,
    img_des_3,
    img_des_4,
    id_category,
  } = req.body;
  const sql_query =
    "UPDATE product SET name=?, price=?, description=?, promotional=?, image=?, img_des_1=?, img_des_2=?, img_des_3=?, img_des_4=?, id_category=? WHERE id=?";
  database.query(
    sql_query,
    [
      name,
      price,
      description,
      promotional,
      image,
      img_des_1,
      img_des_2,
      img_des_3,
      img_des_4,
      id_category,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.json({ msg: err });
      } else {
        return res.json({ msg: "Success" });
      }
    }
  );
};


// delete Product

// dang loi delete product
module.exports.deleteProduct = (req, res) => {
  const { id } = req.query;

  // Kiểm tra xem sản phẩm có tồn tại trong bảng inventory trước khi xóa
  const sql_check_inventory = "SELECT COUNT(*) AS count FROM inventory WHERE id_product = ?";
  database.query(sql_check_inventory, [id], (errInventoryCheck, resultInventoryCheck) => {
    if (errInventoryCheck) {
      return res.status(500).json({ msg: errInventoryCheck });
    }

    if (resultInventoryCheck[0].count > 0) {
      return res.status(400).json({ msg: "Product exists in inventory. Remove it from inventory first." });
    }

    // Nếu sản phẩm không tồn tại trong inventory, tiến hành xóa sản phẩm
    const sql_delete_product = "DELETE FROM product WHERE id = ?";
    database.query(sql_delete_product, [id], (errProduct, resultProduct) => {
      if (errProduct) {
        return res.status(500).json({ msg: errProduct });
      }
      
      // Trả về thông báo thành công nếu không có lỗi
      return res.json({ msg: "Success" });
    });
  });
};








//  add catogory

module.exports.addCategory = (req, res) => {
  const { name, logo, status } = req.body;
  const sql_query = "INSERT INTO category (name, logo, status) VALUES (?, ?, ?)";
  database.query(sql_query, [name, logo, status], (err, result) => {
      if (err) {
          return res.json({ msg: err });
      } else {
          return res.json({ msg: "Success" });
      }
  });
}

// edit 
module.exports.editCategory = (req, res) => {
  const { id, name, logo, status } = req.body;

  const sql_query = "UPDATE category SET name=?, logo=?, status=? WHERE id = ?";
  database.query(sql_query, [name, logo, status, id], (err, result) => {
      if (err) {
          return res.json({ msg: err });
      } else {
          return res.json({ msg: "Success" });
      }
  }); 
} 
// editCategory : patch

//delete category

module.exports.deleteCategory = (req, res) => {
  const categoryId = req.query.id; // Lấy id của category từ URL

  // Truy vấn SELECT để kiểm tra xem category có tồn tại không
  const checkQuery = "SELECT COUNT(*) AS count FROM category WHERE id = ?";
  database.query(checkQuery, [categoryId], (checkErr, checkResult) => {
    if (checkErr) {
      return res.json({ msg: checkErr }); // Trả về thông báo lỗi nếu có lỗi xảy ra trong quá trình kiểm tra
    } else {
      const rowCount = checkResult[0].count;
      if (rowCount === 0) {
        // Nếu không tìm thấy category, trả về thông báo cho người dùng biết rằng ID không tồn tại
        return res.json({ msg: "ID không tồn tại" });
      } else {
        // Nếu category tồn tại, kiểm tra xem có ràng buộc khóa ngoại nào liên kết với category hay không
        const productQuery = "SELECT COUNT(*) AS count FROM product WHERE id_category = ?";
        database.query(productQuery, [categoryId], (productErr, productResult) => {
          if (productErr) {
            return res.json({ msg: productErr }); // Trả về thông báo lỗi nếu có lỗi xảy ra trong quá trình kiểm tra ràng buộc khóa ngoại
          } else {
            const productRowCount = productResult[0].count;
            if (productRowCount > 0) {
              // Nếu có ràng buộc khóa ngoại, trả về thông báo cho người dùng biết rằng không thể xoá category này vì có sản phẩm liên kết
              return res.json({ msg: "Không thể xoá category này vì có sản phẩm liên kết" });
            } else {
              // Nếu không có ràng buộc khóa ngoại, thực hiện truy vấn DELETE
              const deleteQuery = "DELETE FROM category WHERE id = ?";
              database.query(deleteQuery, [categoryId], (deleteErr, deleteResult) => {
                if (deleteErr) {
                  return res.json({ msg: deleteErr }); // Trả về thông báo lỗi nếu có lỗi xảy ra trong quá trình xóa
                } else {
                  return res.json({ msg: "Category deleted successfully" }); // Trả về thông báo thành công nếu không có lỗi
                }
              });
            }
          }
        });
      }
    }
  });
};










