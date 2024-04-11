var database = require("../config/db_connect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Email = require("./email_controller");

// hàm login bị lỗi

// đang ở đây : done
module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body; // truyền username, password vào body PM
    const sql_query = "SELECT * FROM account WHERE username = ?";

    database.query(sql_query, [username], async (err, rows, fields) => {
      if (err) {
        return res.status(500).json({ msg: err.message });
      }
      if (rows.length === 0) {
        return res.status(422).json({ msg: "Tài khoản không hợp lệ" });
      } else {
        // So sánh mật khẩu đã hash trong cơ sở dữ liệu với mật khẩu cung cấp từ yêu cầu
        const passMatch = await bcrypt.compare(password, rows[0].password);
        if (!passMatch) {
          return res.status(422).json({ msg: "Mật khẩu không đúng" });
        } else {
          const theToken = jwt.sign({ id: rows[0].id }, process.env.SECRECT, {
            expiresIn: "1h",
          });
          return res.json({
            msg: "Success",
            token: theToken,
            idUser: rows[0].id,
          });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

// done hehe
module.exports.register = (req, res) => {
  try {
    const { username, password, name, email } = req.body;
    const avatar = ""; // Thiết lập giá trị cho avatar
    const id_role = 2; // Gán quyền cho tài khoản mới mặc định là 2 : user
    const status = 1; // Thiết lập trạng thái tài khoản mới mặc định là 1 là đăng đk thành công

    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    const sqlCheckEmail = "select * from account WHERE email = ?";
    database.query(sqlCheckEmail, [email], async (err, rows, fields) => {
      if (err) {
        return res.status(500).json({ msg: err.message });
      }
      if (rows.length > 0) {
        return res
          .status(422)
          .json({ msg: "Email " + email + " đã được sử dụng" });
      }

      // Nếu email chưa tồn tại, thực hiện thêm tài khoản mới vào cơ sở dữ liệu
      const hashPass = await bcrypt.hash(password, 12); // Hash password
      const sqlRegister =
        "INSERT INTO account (username, password, name, email, avartar, id_role, status, registration_time, last_updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
      database.query(
        sqlRegister,
        [username, hashPass, name, email, avatar, id_role, status],
        (err, result) => {
          if (err) {
            return res.status(500).json({ msg: err.message });
          }
          return res
            .status(201)
            .json({ msg: "Người dùng đã đăng ký thành công" });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports.getAccount = (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(422).json({
                msg: "Vui lòng cung cấp token",
            });
        }

        // Xác thực token và trích xuất id người dùng
        jwt.verify(token, process.env.SECRECT, (err, decoded) => {
            if (err) {
                return res.status(401).json({ msg: "Token không hợp lệ" });
            } else {
                const userId = decoded.id;  // dang thac mac
                console.log('userId:', userId);


                // Truy vấn thông tin người dùng từ cơ sở dữ liệu
                const sql = 'SELECT id_account, username, name, email,id_role, avartar,  status FROM account WHERE id_account = ?';
                database.query(sql, [userId], (err, rows) => {
                    if (err) {
                        return res.status(500).json({ msg: "Lỗi truy vấn cơ sở dữ liệu" });
                    } else {
                        if (rows.length === 0) {
                            return res.status(404).json({ msg: "Không tìm thấy người dùng" });
                        } else {
                            // Trả về thông tin người dùng
                            return res.status(200).json(rows[0]);
                        }
                    }
                });
            }
        });
    } catch (error) {
        return res.status(500).json({ msg: "Lỗi server" });
    }
};



module.exports.checkEmail = (req,res)=>{
    const {email} = req.body;
    const sql = 'select * from account WHERE email = ? ';
    database.query(sql,[email],async(err,rows,fields)=>{
        //Check email exist ?
        if(rows.length > 0 ){
            return res.status(201).json({
                msg: "Email này đã được sử dụng",
            });
        }
        else{
            return res.json({success: "Tiếp tục đăng ký"})
        }
    }
    )
}


// chua hoan thanh
module.exports.forgotPassword = (req,res)=>{
    const {email} = req.body;
    console.log({email});
    const sql = 'select * from account where email = ? ';
    database.query(sql,[email],async(err,rows,fields)=>{
        if (err) {
            return res.status(402).json({
                msg: "Error",
            });
        }
        //Check email exist ?
        if(rows.length == 0 ){
            return res.status(201).json({
                msg: "The E-mail not exist",
            });
        }
        else{
            const user = rows[0];
            const resetUrl = `Hi, please follow this link to reset your password. this link is valid till 10 mins from now. <a href= 'http://localhost:3005/user/reset-password/${user.id} '>Click</a>  `
            Email.SendEmail(email,'Forgot Password Link',
                `
                    Heloo ${user.name}. <br/>
                    ${resetUrl} <br/>
                    Please check your email regularly !

                `)
            return res.json({msg: "Success"})
        }
    }
    )
}


const generateRandomPassword = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

module.exports.resetPassword = async (req, res) => {
    try {
        const passwordLength = 8; // Độ dài mật khẩu muốn tạo
        const password = generateRandomPassword(passwordLength); // Tạo mật khẩu ngẫu nhiên

        const hashPass = await bcrypt.hash(password, 12); // Hash mật khẩu

        const { id } = req.body;
        const sql = 'SELECT * FROM account WHERE id_account = ? ';
        database.query(sql, [id], async (err, rows, fields) => {
            if (err) {
                return res.status(500).json({ msg: err.message });
            }
            if (rows.length === 0) {
                return res.status(404).json({ msg: "The Email does not exist" });
            }
            const user = rows[0];
            const sql2 = 'UPDATE account SET password = ? WHERE id_account = ? ';
            database.query(sql2, [hashPass, id], async (err, rows, fields) => {
                if (err) {
                    return res.status(500).json({ msg: err.message });
                }
                Email.SendEmail(user.email, 'Forgot Password Link',
                    `
                    Hello ${user.name}. <br/>
                    Your password has been reset <br/>
                    New password : ${password} <br>
                    Please check your email regularly !
                    `
                );
                return res.status(200).json({ msg: "Success" });
            });
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};
