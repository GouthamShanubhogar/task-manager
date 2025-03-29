import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Save, X, CheckCircle2, LogOut, ChevronDown, Tag } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useNavigate } from 'react-router-dom';

interface Task {
    id: string;
    title: string;
    completed: boolean;
    category?: string;
}

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Others'];

const Dashboard = () => {
    const navigate = useNavigate();
    const { tasks, addTask, updateTask, deleteTask, loading, fetchTasks } = useTasks();
    const [newTask, setNewTask] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState({ status: 'All', category: 'All' });
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

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

    const handleLogout = () => {
        // Add your logout logic here
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleFilterDropdown = () => {
        setFilterDropdownOpen((prev) => !prev);
    };

    const handleFilterChange = (type: 'status' | 'category', value: string) => {
        setFilter((prev) => ({ ...prev, [type]: value }));
        setFilterDropdownOpen(false); // Close dropdown after selection
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            filter.status === 'All' ||
            (filter.status === 'Completed' && task.completed) ||
            (filter.status === 'Incomplete' && !task.completed);
        const matchesCategory =
            filter.category === 'All' || task.category === filter.category;
        return matchesStatus && matchesCategory;
    });

    const incompleteTasks = filteredTasks.filter((task) => !task.completed);
    const completedTasks = filteredTasks.filter((task) => task.completed);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Enhanced Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">📝</span>
                            <span className="text-2xl font-semibold text-gray-800">Task Manager</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
                        >
                            <LogOut size={20} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Search and Add Task Section */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 transform transition-all duration-200 hover:shadow-2xl">
                    {/* Search and Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                            />
                        </div>
                        <div className="relative">
                            <button
                                onClick={toggleFilterDropdown}
                                className="px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                Filter
                            </button>
                            {filterDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <div className="p-2">
                                        <span className="block text-sm font-medium text-gray-700 mb-1">Status</span>
                                        <select
                                            value={filter.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="All">All</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Incomplete">Incomplete</option>
                                        </select>
                                    </div>
                                    <div className="p-2">
                                        <span className="block text-sm font-medium text-gray-700 mb-1">Category</span>
                                        <select
                                            value={filter.category}
                                            onChange={(e) => handleFilterChange('category', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="All">All</option>
                                            {CATEGORIES.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Enhanced Add Task Form */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Add a new task"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                            className="flex-1 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                        />
                        <button
                            onClick={handleAddTask}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-xl"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">Add Task</span>
                        </button>
                    </div>
                </div>

                {/* Task Lists with Enhanced Styling */}
                <div className="space-y-8">
                    {/* Incomplete Tasks */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 px-1">Pending Tasks ({incompleteTasks.length})</h2>
                        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                            {incompleteTasks.map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
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
                            <h2 className="text-xl font-semibold text-gray-700 mb-4 px-1">Completed ({completedTasks.length})</h2>
                            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                                {completedTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-3 bg-gray-50/80 backdrop-blur-md p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        <button
                                            onClick={() => handleToggleTask(task.id, task.completed)}
                                            className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white"
                                        >
                                            <CheckCircle2 size={20} />
                                        </button>
                                        <span className="flex-1 text-gray-500">{task.title}</span>
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

                    {/* Empty State */}
                    {filteredTasks.length === 0 && (
                        <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-md">
                            <div className="text-gray-400 text-lg mb-2">
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