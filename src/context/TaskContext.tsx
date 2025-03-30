import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  category?: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: { title: string; category: string }) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: true,
  addTask: async () => {}, 
  updateTask: async () => {}, 
  deleteTask: async () => {}, 
  fetchTasks: async () => {}, 
});

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found. Skipping fetchTasks...');
      setTasks([]); // Clear tasks
      setLoading(false); // Ensure loading state is updated
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      const error = err as any; // Explicitly cast to 'any'
      console.error('Failed to fetch tasks:', error);
      if (error.response?.status === 401) {
        console.error('Unauthorized. Logging out...');
        localStorage.removeItem('token'); // Clear invalid token
        setTasks([]); // Clear tasks
        window.location.href = '/login'; // Redirect to login page
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchTasks();
    } else {
      console.warn('No token found during useEffect. Skipping fetchTasks...');
      setLoading(false); // Ensure loading state is updated
    }
  }, [fetchTasks]);

  const addTask = async ({ title, category }: { title: string; category: string }) => {
    try {
      if (!title || !category) {
        throw new Error('Title and category are required');
      }
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/tasks',
        { title, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prevTasks) => [response.data, ...prevTasks]);
    } catch (err) {
      const error = err as any; // Explicitly cast to 'any'
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? response.data : task))
      );
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
