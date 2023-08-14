const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  port: 3001, 
  user: 'user',
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to the database');
});


app.get('/characters', async (req, res) => {
  try {
   
    const characters = await db.query('SELECT * FROM characters');
    res.json(characters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/characters', async (req, res) => {
  try {
    const { name, role } = req.body;
   
    await db.query('INSERT INTO characters (name, role) VALUES (?, ?)', [name, role]);
    res.json({ message: 'Character created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/characters/:id', async (req, res) => {
  try {
    const { name, role } = req.body;
    const id = req.params.id;
  
    await db.query('UPDATE characters SET name = ?, role = ? WHERE id = ?', [name, role, id]);
    res.json({ message: 'Character updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/characters/:id', async (req, res) => {
  try {
    const id = req.params.id;
  
    await db.query('DELETE FROM characters WHERE id = ?', [id]);
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
});
