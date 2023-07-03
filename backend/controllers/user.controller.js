const { pool } = require('../app');

const getAllUsers = async (req, res) => {
    try {
        let conn = await pool.getConnection();
        let rows = await conn.query('SELECT id, username, email, primaryAddressId, registeredAt, role FROM user');

        conn.release();

        if(!rows.length) {
            return res.status(404).json('No user-list found.');
        }

        console.log(`Sending all users data`);
        return res.json(rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal server error.');
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        let conn = await pool.getConnection();
        let rows = await conn.query('SELECT id, username, email, primaryAddressId, registeredAt, role FROM user WHERE id = ?', [id]);

        conn.release();

        if(!rows.length) {
            return res.status(404).json('No user found with the provided ID.');
        }

        console.log(`Sending user data (id: ${rows[0].id})`);
        return res.json(rows[0]);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal server error.');
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;

        let conn = await pool.getConnection();
        let result = await conn.query('UPDATE user SET username = ?, email = ?, role = ? WHERE id = ?',
            [username, email, role, id]);

        conn.release();

        if(!result.affectedRows) {
            return res.status(404).json('No user found with the provided ID.');
        }

        console.log(`Updated user (id: ${id})`);
        return res.json({ message: 'User updated successfully.' });
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal server error.');
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        let conn = await pool.getConnection();
        let result = await conn.query('DELETE FROM user WHERE id = ?', [id]);

        conn.release();

        if(!result.affectedRows) {
            return res.status(404).json('No user found with the provided ID.');
        }

        console.log(`Deleted user (id: ${id})`);
        return res.json({ message: 'User deleted successfully.' });
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal server error.');
    }
};


module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}
