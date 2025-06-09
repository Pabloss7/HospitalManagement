const authService = require('../services/auth.service');

const login = async(req, res) => {
    try{
        const { username, password } = req.body;

        const token = await authService.login(username, password);
        res.status(201).json({ token });
    }catch(error){
        res.status(401).json({ message: error.message});
    }
}

const logout = async(req, res) => {
    try{
        res.status(200).json({ message: 'Logout succesfully'});
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

module.exports = { login, logout };