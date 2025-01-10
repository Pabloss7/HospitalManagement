const userRepository = require('../repositories/user.repository');

const createUser = async (req,res) => {
    try{
        const user = await userRepository.createUser(
            req.body.username,
            req.body.password,
            req.body.role,
            req.body.details
        );
        res.status(201).json(user);
    }catch(error){
        res.status(400).json({message: error});
    }
}

const updateUser = async(req,res) => {
    const {id} = req.params;
    if(id == null){
        return res.status(400).json({message: 'Id required'});
    }
    const {username} = req.body;
    if(username == null){
        return res.status(400).json({message: 'Bad request'});
    }

    try{
        const updatedUser = await userRepository.updateUser(id,username);
        res.status(200).json(updatedUser);
    }catch(error){
        res.status(404).json({message: error});
    }
}

const getUserById = async(req,res)=>{
    const {id} = req.params;
    console.log(req.params);
    if(!id){
        return res.status(400).json({message: 'id required'});
    } 
    
    try{
        const user = await userRepository.getUser(id);
        res.status(201).json({message:'User:',user});
    }catch(error){
        res.status(404).json({message: error});
    }
}

const getAllUsers = async (req,res) =>{
    try{
        const users = await userRepository.getAllUsers();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message: error});
    }
}

const getUsersAdmin = async(req,res) => {
    try{
        const users = await userRepository.getUsersAdmin();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports = {getAllUsers,createUser,getUserById,updateUser,getUsersAdmin};