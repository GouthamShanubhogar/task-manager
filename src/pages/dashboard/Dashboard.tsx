import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Save, X, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

const Dashboard = () => {
    const { tasks, addTask, updateTask, deleteTask, loading, fetchTasks } = useTasks();
    const [newTask, setNewTask] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAddTask = async () => {
        if (!newTask.trim()) return;
        try {
            await addTask(newTask.trim());
            setNewTask('');
        } catch (err) {
            console.error('Failed to add task:', err);
            alert('Failed to add task. Please try again.');
        }
    };

    const handleToggleTask = async (id: string, completed: boolean) => {
        try {
            await updateTask(id, { completed: !completed });
        } catch (err) {
            console.error('Failed to toggle task:', err);
            alert('Failed to update task. Please try again.');
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id);
        } catch (err) {
            console.error('Failed to delete task:', err);
            alert('Failed to delete task. Please try again.');
        }
    };

    const startEditing = (task: Task) => {
        setEditingId(task.id);
        setEditingText(task.title);
    };

    const handleSaveEdit = async () => {
        if (!editingText.trim() || !editingId) return;
        try {
            await updateTask(editingId, { title: editingText.trim() });
            setEditingId(null);
        } catch (err) {
            console.error('Failed to update task:', err);
            alert('Failed to update task. Please try again.');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingText('');
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const completedTasks = filteredTasks.filter(task => task.completed);
    const incompleteTasks = filteredTasks.filter(task => !task.completed);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-xl text-gray-600">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Manager</h1>
                    <p className="text-gray-600">Organize your tasks efficiently</p>
                </div>

                {/* Search and Add Task Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                        />
                    </div>

                    {/* Add Task Form */}
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Add a new task"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                        />
                        <button
                            onClick={handleAddTask}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 font-medium"
                        >
                            <Plus size={20} />
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Task Lists */}
                <div className="space-y-8">
                    {/* Incomplete Tasks */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Tasks ({incompleteTasks.length})</h2>
                        <div className="space-y-3">
                            {incompleteTasks.map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <button
                                        onClick={() => handleToggleTask(task.id, task.completed)}
                                        className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-blue-500 flex items-center justify-center transition-colors duration-200"
                                    >
                                        <div className="w-3 h-3 rounded-full bg-transparent" />
                                    </button>

                                    {editingId === task.id ? (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleSaveEdit}
                                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                            >
                                                <Save size={20} />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-gray-700">{task.title}</span>
                                            <button
                                                onClick={() => startEditing(task)}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                            >
                                                <Edit2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Completed Tasks */}
                    {completedTasks.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Completed ({completedTasks.length})</h2>
                            <div className="space-y-3">
                                {completedTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl"
                                    >
                                        <button
                                            onClick={() => handleToggleTask(task.id, task.completed)}
                                            className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white"
                                        >
                                            <CheckCircle2 size={20} />
                                        </button>
                                        <span className="flex-1 text-gray-500 line-through">{task.title}</span>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredTasks.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <div className="text-gray-400 mb-2">
                                {searchQuery ? 'No tasks found' : 'No tasks yet'}
                            </div>
                            <p className="text-gray-500">
                                {searchQuery ? 'Try a different search term' : 'Add your first task above'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;