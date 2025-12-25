import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; //aplanumerickey to generate token
import db from '../db.js';

const router = express.Router();

router.post('/register', (req, res) => {
    const {username, password} = req.body;
    //save username and an irreversibly encryoted password

    //enrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8); 
    try{
        const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        const result = insertUser.run(username, hashedPassword);

        //default todo
        const defaultTodo =`Hello ;) Add your first todo!`;
        const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');
        insertTodo.run(result.lastInsertRowid, defaultTodo); // lastInsertRowid gives the id of the last inserted row


        //create a token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: 86400 });//24 hours
        res.json({token});
    }catch(err){
        return res.status(503).send("There was a problem registering the user.");
    }

})

router.post('/login', (req, res) => {
    //paswrd willbe encrypted
    
    const {username, password} = req.body;

    try{
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = getUser.get(username); //it injects the username  to the ?

        if(!user){ return res.status(404).send("User not found."); }

        const passwordIsValid = bcrypt.compareSync(password, user.password); //comapring passwords
        if(!passwordIsValid){ return res.status(401).send({ message: "Invalid password"}); }

        //successful login, create a token
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 86400 });//24 hours
        res.json({token});
    }catch(err){
        console.log(err);
        return res.status(503)
    }
})

export default router;