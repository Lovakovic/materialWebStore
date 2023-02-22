const { pool } = require('../app');
const { secret, tokenExpiration } = require('../config');
const { promisify } = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// WARNING: There is ZERO SQLInjection protection here, use at your own risk

// Register credentials:
// const credentials = {
//   username: 'username',
//   password: 'password',
//   email: 'email'
// };

// Login credentials
// const credentials = {
//   email: 'email',
//   password: 'password'
// }

// This is only a helper function for registration or login functions, not an API endpoint
const checkIfEmailExists = async (email) => {
  try {
    let conn = await pool.getConnection();

    let rows = await conn.query('SELECT * FROM user WHERE email = ?', email);

    return rows.length > 0;
  } catch (e) {
    console.log(e);
  }
};

const registerUser = async (req, res) => {
  const credentials = req.body;
  credentials.password = await bcrypt.hash(credentials.password, 10);

  try {
    const emailTaken = await checkIfEmailExists(credentials.email);

    if(emailTaken) {
      res.status(409);
      return res.json('Email address taken.');
    }

    let conn = await pool.getConnection();
    conn.query(`INSERT INTO user (username, password, email) VALUES
                       (?, ?, ?)`, [credentials.username, credentials.password, credentials.email]);

    conn.release();

    res.json('Successful registration');
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json('Error with query.');
  }
};

const attemptLogin = async (req, res) => {
  try {
    const credentials = req.body;

      const userExists = await checkIfEmailExists(credentials.email);
      if(!userExists) {
        res.status(404);
        return res.json('User not found.');
      }

      let conn = await pool.getConnection();
      let rows = await conn.query('SELECT id, password FROM user WHERE email = ?', credentials.email);

      // Checked if user exists above and email is unique, so no need to do so again
      const passwordCorrect = await bcrypt.compare(credentials.password, rows[0].password);

      if(passwordCorrect) {

        // Create a token and send it in a configured cookie
        const id = rows[0].id;
        const token = jwt.sign({ id }, secret, {
          expiresIn: tokenExpiration
        });

        console.log(token);

        const cookieOptions = {
          expires: new Date(
              Date.now() + tokenExpiration * 1000
          ),
          httpOnly: true
        }
        res.cookie('loginToken', token, cookieOptions);
        return res.json();
      }

      res.status(401);
      return res.json('Wrong password.');
  } catch(e) {
    console.log(e);
    res.status(500);
    return res.json('Error with query.');
  }
};

const isEmailTaken = async (req, res) => {
  const email = req.body.email;
  const emailTaken = await checkIfEmailExists(email);

  if(emailTaken) {
    return res.status(200).json(true);
  }

  return res.status(200).json(false);
};

const isLoggedIn = async (req, res, next) => {
  if(req.cookies.loginToken) {
    try {
      // Verify token
      const decoded = await promisify(jwt.verify)(req.cookies.loginToken, secret);
      console.log(decoded);

      // Check if the user still exists
      let conn = await pool.getConnection();
      let rows = await  conn.query('SELECT id FROM user WHERE id = ?', decoded.id);
      const userFound = rows.length === 1;

      if(!userFound) {
        return next();
      }

      req.userId = rows[0].id;
      next();
    } catch (e) {

    }
  }
};

const logout = (req, res) => {
  res.cookie('loginToken', 'logout', {
    expires: new Date(Date.now()) + 2 * 1000,
    httpOnly: true
  });
  res.json();
}

module.exports = {
  registerUser,
  attemptLogin,
  isEmailTaken
};
