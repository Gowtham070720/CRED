const express = require('express');
let users = JSON.parse(fs.readFileSync('./sample.json', 'utf-8'));
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(cors());
app.get('/users', (req, res) => {
    return res.json(users);
});

// Delete user by ID
app.delete('/users/:id', (req, res) => {
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user) => user.id !== id);
    fs.writeFile('./sample.json', JSON.stringify(filteredUsers), (err,data)=>{
        return res.json(filteredUsers);
    });
});

// Add new user
app.post('/users', (req, res) => {
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).json({ error: "Name, age, and city are required" });
    }
    let id = Date.now();
    users.push({ id, name, age, city });
    fs.writeFile('./sample.json', JSON.stringify(users), (err,data) => {
        return res.json({ message: "User added successfully" });
    });
    
});

// Update user by ID
app.patch('/users/:id', (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).json({ error: "Name, age, and city are required" });
    }

    let index = users.findIndex((user) => user.id == id);

    users.splice(index,1,{...req.body});
    
    
    fs.writeFile('./sample.json', JSON.stringify(users), (err,data) => {
        return res.json({ message: "User updated successfully" });
    });
    
});



app.listen(PORT, (err) => {
    console.log(`Server is running on port ${PORT}`);
});