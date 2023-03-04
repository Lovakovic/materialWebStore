const { pool } = require('../app');
const { secret, tokenExpiration } = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    return res.json('Success');
  } catch (e) {
    console.log(e);
    return res.status(500).json('Internal server error.');
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

        const cookieOptions = {
          expires: new Date(
              Date.now() + tokenExpiration * 1000
          ),
          httpOnly: true,
          sameSite: 'Strict',
          secure: true
        };

        console.log(`User logged in, id: ${id} with token ${token} that expires in ${tokenExpiration}`);
        res.cookie('loginToken', token, cookieOptions);
        return res.json(cookieOptions.expires);
      }

      return res.status(401).json('Wrong password.');
  } catch(e) {
    console.log(e);
    return res.status(500).json('Internal server error.');
  }
};

const getProfile = async (req, res) => {
    try {
      const userId = req.userId;

      // Check if the user still exists
      let conn = await pool.getConnection();
      let rows = await  conn.query('SELECT id, username, email, primaryAddressId FROM user WHERE id = ?',
          userId);

      conn.release();

      const userFound = rows.length === 1;

      if(!userFound) {
        return res.status(401).json('Missing user.');
      }

      const userData = { ...rows[0] };

      console.log(`Sending user data (id: ${userData.id})`);
      return res.json(userData);
    } catch (e) {
      console.log(e);
      return res.status(500).json('Internal server error.');
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

const logout = (req, res) => {
  res.cookie('loginToken', 'logout', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
    sameSite: 'Strict',
    secure: true
  });
  return res.json('Success');
}

module.exports = {
  registerUser,
  attemptLogin,
  getProfile,
  isEmailTaken,
  logout
};
