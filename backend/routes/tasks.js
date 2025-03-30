import express from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Invalid token:', err?.message); // Use optional chaining
    return res.status(401).json({ msg: 'Invalid token' });
  }
};

// Get all tasks for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await pool.query(
      'SELECT id, user_id, title, completed, category, created_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(tasks.rows); 
  } catch (err) {
    console.error('Error fetching tasks:', err?.message); // Use optional chaining
    res.status(500).json({ msg: 'Failed to fetch tasks' });
  }
});

// Create a new task
router.post('/', authenticateToken, async (req, res) => {
  const { title, category } = req.body;
  try {
    if (!title || !category) {
      return res.status(400).json({ msg: 'Title and category are required' });
    }
    const newTask = await pool.query(
      'INSERT INTO tasks (user_id, title, category) VALUES ($1, $2, $3) RETURNING id, user_id, title, completed, category, created_at',
      [req.userId, title, category]
    );
    res.json(newTask.rows[0]); 
  } catch (err) {
    console.error('Error adding task:', err?.message); // Use optional chaining
    res.status(500).json({ msg: 'Failed to add task' });
  }
});

// Update a task
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, completed, category } = req.body;
  try {
    const updatedTask = await pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), completed = COALESCE($2, completed), category = COALESCE($3, category) WHERE id = $4 AND user_id = $5 RETURNING id, user_id, title, completed, category, created_at',
      [title, completed, category, id, req.userId]
    );
    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json(updatedTask.rows[0]); 
  } catch (err) {
    console.error('Error updating task:', err?.message); // Use optional chaining
    res.status(500).json({ msg: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err?.message); // Use optional chaining
    res.status(500).json({ msg: 'Failed to delete task' });
  }
});

export default router;
