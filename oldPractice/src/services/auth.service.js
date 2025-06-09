const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

const login = async(username, password) => {
    const user = await userRepository.findByUsername(username);

    if(!user){
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, role: user.role}, SECRET_KEY, { expiresIn: '1h'});
    return token;
}

module.exports = { login };