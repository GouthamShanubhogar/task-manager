import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};

// Get all tasks for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(tasks.rows);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Create a new task
router.post('/', authenticateToken, async (req, res) => {
  const { title } = req.body;
  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING *',
      [req.userId, title]
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update a task
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const updatedTask = await pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 AND user_id = $4 RETURNING *',
      [title, completed, id, req.userId]
    );
    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json(updatedTask.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
