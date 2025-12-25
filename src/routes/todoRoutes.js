import express from 'express';
import db from '../db.js';

const router = express.Router();

//get all todos for a user
router.get('/',(req,res)=>{
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?');
    const todos = getTodos.all(req.userId); // assuming req.userId is set after authentication
    res.json(todos);
})

//create a new todo
router.post('/',(req,res)=>{
    const {task} = req.body;
    const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');
    const result = insertTodo.run(req.userId, task);

    res.json({id: result.lastInsertRowid, task, completed: 0});
})

//update a todo by id
router.put('/:id',(req,res)=>{
    const {completed} = req.body; // 3 different ways to send request data
    const {id} = req.params;
    const {page} = req.query;

    const updateTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
    updateTodo.run(completed, id);

    res.json({messag: 'Todo updated successfully'}) ;

})  // /:id - dynamic query parameter

//delete a todo by id
router.delete('/:id',(req,res)=>{
    const {id} = req.params;
    const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
    deleteTodo.run(id, req.userId);

    res.send({message: 'Todo deleted successfully'});
})

export default router;