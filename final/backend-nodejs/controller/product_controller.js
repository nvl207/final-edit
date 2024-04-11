var database = require("../config/db_connect");

//  product

// get full product  dod
module.exports.getProduct = (req, res) => {
  const sql_query = "select * from product";
  database.query(sql_query, (err, result) => {
    return res.send(result);
  });
}; //done

// search product
module.exports.searchProduct = (req, res) => {
  const { keyword } = req.query; 
  const sql_query = `SELECT * FROM product WHERE id_product like '%${keyword}%' or name LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`;

  database.query(sql_query, (err, rows) => {
    if (err) {
      return res.status(500).json({ msg: 'Error searching for products' });
    } else {
      return res.json(rows);
    }
  }); // done : http://localhost:3005/product/searchProduct/?keyword=product%202
};


// category
module.exports.getCategory = (req, res) => {
  const sql_query = "select * from category";
  database.query(sql_query, (err, result) => {
    return res.send(result);
  }); //done
};

// get category by id

module.exports.getCategoryById = (req, res) => {
  const id = req.params.id;
  const sql_query = `SELECT * FROM category WHERE id_category='${id}'`;
  database.query(sql_query, (err, result) => {
    if (err) {
      return res.status(500).send("Error occurred");
    }
    return res.send(result);
  });
};

//get product by category

module.exports.getProductByCategory = (req, res) => {
  const id = req.params.id;
  const sql_query = `SELECT p.id_product, p.name AS product_name, p.price, p.description, p.status AS product_status, p.image, p.img_des_1, p.img_des_2, p.img_des_3, p.img_des_4,c.id_category AS category_id, c.name AS category_name, c.logo, c.status AS category_status FROM product AS p INNER JOIN category AS c ON p.id_category = c.id_id_category WHERE c.id_category = ${id} `;
  database.query(sql_query, (err, result) => {
    if (err) {
      return res.status(500).send("Err");
    }
    return res.send(result);
  });
};

// get product inventory

module.exports.getProductInventory = (req, res) => {
  const id = req.query.id; // Thay đổi từ req.params.id sang req.query.id
  const sql_query = `SELECT * FROM inventory WHERE id_inventory = ?`;
  database.query(sql_query, [id], (err, result) => {
    if (err) {
      return res.status(500).send("Err");
    }
    return res.send(result);
  });
};

