import { useState, useEffect, useRef } from 'react';
import { Search, Add, Delete, Edit, Save, Close, CheckCircle, Logout, CalendarToday, Label, FilterList } from '@mui/icons-material'; // Replaced lucide-react with Material UI icons
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
    const { tasks, addTask, updateTask, deleteTask, fetchTasks } = useTasks();
    const [newTask, setNewTask] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState({ status: 'All', category: 'All' });
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const filterDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
                setFilterDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddTask = async () => {
        if (!newTask.trim() || !selectedCategory) {
            alert('Please enter a task name and select a category.');
            return;
        }
        try {
            await addTask({ title: newTask.trim(), category: selectedCategory });
            setNewTask('');
            setSelectedCategory('');
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
        const confirmDelete = window.confirm('Are you sure you want to delete this task?');
        if (!confirmDelete) return;

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
        if (!editingText.trim() || !editingId) {
            alert('Please enter a valid task title.');
            return;
        }
        try {
            await updateTask(editingId, { title: editingText.trim() });
            setEditingId(null);
            setEditingText('');
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
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleFilterDropdown = () => {
        setFilterDropdownOpen((prev) => !prev);
    };

    const handleFilterChange = (type: 'status' | 'category', value: string) => {
        setFilter((prev) => ({ ...prev, [type]: value }));
        setFilterDropdownOpen(false);
    };

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'Work': return 'bg-blue-100 text-blue-800';
            case 'Personal': return 'bg-purple-100 text-purple-800';
            case 'Shopping': return 'bg-green-100 text-green-800';
            case 'Health': return 'bg-red-100 text-red-800';
            case 'Others': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            filter.status === 'All' ||
            (filter.status === 'Completed' && task.completed) ||
            (filter.status === 'Incomplete' && !task.completed);
        const matchesCategory =
            filter.category === 'All' || task.category === filter.category;
        const matchesSearchQuery =
            task.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesCategory && matchesSearchQuery;
    });

    const incompleteTasks = filteredTasks.filter((task) => !task.completed);
    const completedTasks = filteredTasks.filter((task) => task.completed);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

            <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-lg shadow-md">
                                <span className="text-xl">📋</span>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">TaskFlow</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                        >
                            <Logout fontSize="small" />
                            <span className="hidden sm:inline font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your tasks efficiently</p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 flex items-center transition-all duration-300 hover:shadow-lg border-l-4 border-indigo-500">
                        <div className="p-3 rounded-full bg-indigo-100 mr-4">
                            <CalendarToday className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Tasks</p>
                            <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
                        </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 flex items-center transition-all duration-300 hover:shadow-lg border-l-4 border-purple-500">
                        <div className="p-3 rounded-full bg-purple-100 mr-4">
                            <CheckCircle className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Completed</p>
                            <p className="text-2xl font-bold text-gray-800">{completedTasks.length}</p>
                        </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 flex items-center transition-all duration-300 hover:shadow-lg border-l-4 border-pink-500">
                        <div className="p-3 rounded-full bg-pink-100 mr-4">
                            <FilterList className="text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-gray-800">{incompleteTasks.length}</p>
                        </div>
                    </div>
                </div>


                <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl border border-gray-100 relative z-[9999]">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Task</h2>


                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
                            />
                        </div>
                        <div className="relative" ref={filterDropdownRef}>
                            <button
                                onClick={toggleFilterDropdown}
                                className="w-full lg:w-auto px-6 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <span>Filter</span>
                            </button>
                            {filterDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow-xl z-[9999]"> {/* Increased z-index to z-[9999] */}
                                    <div className="p-4">
                                        <span className="block text-sm font-medium text-gray-700 mb-2 text-center"> {/* Added text-center */}
                                            Status
                                        </span>
                                        <select
                                            value={filter.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                            className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-center" // Updated border to border-gray-300 and added text-center
                                        >
                                            <option value="All" className="text-center">All</option>
                                            <option value="Completed" className="text-center">Completed</option>
                                            <option value="Incomplete" className="text-center">Incomplete</option>
                                        </select>
                                    </div>
                                    <div className="p-4 border-t border-gray-300">
                                        <span className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                            Category
                                        </span>
                                        <select
                                            value={filter.category}
                                            onChange={(e) => handleFilterChange('category', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-center" // Updated border to border-gray-300 and added text-center
                                        >
                                            <option value="All" className="text-center">All</option>
                                            {CATEGORIES.map((category) => (
                                                <option key={category} value={category} className="text-center">
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="What do you need to do?"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                            className="flex-1 px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300"
                        />
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <Label fontSize="small" className="text-gray-400" />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 appearance-none text-center" // Added text-center
                                style={{ textAlign: 'center', textAlignLast: 'center' }} // Ensures text alignment for dropdown options
                            >
                                <option value="" disabled> {/* Added inline style */}
                                    Category
                                </option>
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category} style={{ textAlign: 'center' }}> {/* Added inline style */}
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleAddTask}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transform hover:translate-y-px active:translate-y-1"
                        >
                            <Add fontSize="small" />
                            <span>Add Task</span>
                        </button>
                    </div>
                </div>


                <div className="space-y-8">
                    {/* Incomplete Tasks */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                <span className="text-indigo-600 font-bold">{incompleteTasks.length}</span>
                            </div>
                            Pending Tasks
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                            {incompleteTasks.length > 0 ? (
                                incompleteTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-3 bg-gray-50/70 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <button
                                            onClick={() => handleToggleTask(task.id, task.completed)}
                                            className="w-6 h-6 rounded-full border-2 border-indigo-300 hover:border-indigo-500 flex items-center justify-center transition-colors duration-300"
                                            aria-label="Mark as complete"
                                        >
                                            <div className="w-3 h-3 rounded-full bg-transparent" />
                                        </button>

                                        {editingId === task.id ? (
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                    className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-300"
                                                    aria-label="Save"
                                                >
                                                    <Save fontSize="small" />
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-300"
                                                    aria-label="Cancel"
                                                >
                                                    <Close fontSize="small" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="flex-1 text-gray-700 font-medium">{task.title}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                                                    {task.category}
                                                </span>
                                                <button
                                                    onClick={() => startEditing(task)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-300"
                                                    aria-label="Edit"
                                                >
                                                    <Edit fontSize="small" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                                                    aria-label="Delete"
                                                >
                                                    <Delete fontSize="small" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                searchQuery ? (
                                    <div className="col-span-full text-center py-10">
                                        <div className="text-gray-400 text-lg mb-2">No matching tasks found</div>
                                        <p className="text-gray-500">Try a different search term or filter</p>
                                    </div>
                                ) : (
                                    <div className="col-span-full text-center py-10">
                                        <div className="text-gray-400 text-lg mb-2">No pending tasks</div>
                                        <p className="text-gray-500">Enjoy your free time!</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Completed Tasks */}
                    {completedTasks.length > 0 && (
                        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                    <span className="text-green-600 font-bold">{completedTasks.length}</span>
                                </div>
                                Completed Tasks
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                                {completedTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-3 bg-gray-50/70 p-4 rounded-xl border border-gray-100 shadow-sm transition-all duration-300"
                                    >
                                        <button
                                            onClick={() => handleToggleTask(task.id, task.completed)}
                                            className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white transition-colors duration-300 hover:bg-green-600"
                                            aria-label="Mark as incomplete"
                                        >
                                            <CheckCircle fontSize="small" />
                                        </button>
                                        <span className="flex-1 text-gray-500">{task.title}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full opacity-70 ${getCategoryColor(task.category)}`}>
                                            {task.category}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                                            aria-label="Delete"
                                        >
                                            <Delete fontSize="small" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {tasks.length === 0 && (
                        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-10 text-center border border-gray-100">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📋</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Tasks Yet</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Add your first task using the form above to get started with your productivity journey.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;