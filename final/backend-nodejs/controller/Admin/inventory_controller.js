var database = require("../../config/db_connect");



// get inventory
module.exports.getInventory = (req, res) => {
    const sql_query = `
        SELECT inventory.*, product.name AS product_name, product.price AS product_price, product.image AS product_image 
        FROM inventory 
        INNER JOIN product ON inventory.id_product = product.id_product
    `;
    database.query(sql_query, (err, result) => {
        if (err) {
            return res.json({msg: err});
        } else {
            return res.json(result);
        }
    });
};


// add inventory
module.exports.addInventory = (req, res) => {
    const { id_product, size, quantity } = req.body;

    // Kiểm tra xem id_product có tồn tại trong bảng product không
    const checkProductQuery = "SELECT * FROM product WHERE id_product = ?";
    database.query(checkProductQuery, [id_product], (err, rows) => {
        if (err) {
            return res.json({ msg: err });
        }

        if (rows.length === 0) {
            return res.json({ msg: "Product with id " + id_product + " does not exist" });
        }

        // Nếu id_product tồn tại, thực hiện thêm vào bảng inventory
        const addInventoryQuery = "INSERT INTO inventory (id_product, quantity, status, sold, size) VALUES (?, ?, ?, ?, ?)";
        database.query(addInventoryQuery, [id_product, quantity, 1, 0, size], (err, result) => {
            if (err) {
                return res.json({ msg: err });
            } else {
                return res.json({ msg: "Inventory added successfully" });
            }
        });
    });
};


// delete inventory

module.exports.deleteInventory = (req, res) => {
    // Trích xuất ID từ query string của URL
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ msg: "Missing ID parameter" });
    }

    const sql = "DELETE FROM `inventory` WHERE id_inventory = ?";
    database.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err });
        } else {
            return res.status(200).json({ msg: "Success" });
        }
    });
};


// update inventory
module.exports.updateInventory = (req, res) => {
    const { id, quantity, status, sold, size } = req.body;

    if (!id || !quantity || !status || !sold || !size) {
        return res.status(400).json({ msg: "Missing required fields" });
    }

    const sql = "UPDATE `inventory` SET quantity = ?, status = ?, sold = ?, size = ? WHERE id_inventory = ?";
    database.query(sql, [quantity, status, sold, size, id], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err });
        } else {
            return res.status(200).json({ msg: "Inventory updated successfully" });
        }
    });
};

