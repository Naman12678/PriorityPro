import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../store/tasksSlice';
import { Trash2, CheckCircle, Circle, Edit2, Save, X, ArrowUpDown } from 'lucide-react';

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks.items);
  const dispatch = useDispatch();

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const getPriorityColor = (priority) => {
    const baseColors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return baseColors[priority] || 'bg-gray-100 text-gray-800';
  };

  const handleToggleTask = (task) => {
    dispatch(updateTask({ id: task._id, updates: { completed: !task.completed } }));
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handleEditTask = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = (task) => {
    if (editTitle.trim()) {
      dispatch(updateTask({ id: task._id, updates: { title: editTitle.trim() } }));
      setEditingTask(null);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'completed') return task.completed;
      if (filter === 'active') return !task.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="max-w-2xl mx-auto space-y-4 relative">
      {/* Filters and Sorting */}
      <div className="flex justify-between items-center mb-4 text-gray-700">
        <div className="flex space-x-2">
          {['all', 'active', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm capitalize transition duration-200 ${
                filter === status ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'createdAt' ? 'priority' : 'createdAt')}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition duration-200"
        >
          <ArrowUpDown size={16} />
          <span className="text-sm">{sortBy === 'createdAt' ? 'Recent' : 'Priority'}</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className={`p-4 rounded-lg border bg-white border-gray-300 ${
              task.completed ? 'opacity-70' : ''
            } hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => handleToggleTask(task)}
                  className="text-gray-500 hover:text-blue-600 focus:outline-none"
                >
                  {task.completed ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6" />}
                </button>

                {editingTask === task._id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(task)}
                      className="text-green-500 hover:bg-green-100 p-1 rounded"
                    >
                      <Save size={20} />
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="text-red-500 hover:bg-red-100 p-1 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <span className={`text-sm px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {editingTask !== task._id && (
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-gray-500 hover:text-blue-600 focus:outline-none"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-gray-500 hover:text-red-600 focus:outline-none"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {filter === 'all' && 'No tasks yet. Add one to get started!'}
          {filter === 'active' && 'No active tasks.'}
          {filter === 'completed' && 'No completed tasks.'}
        </div>
      )}
    </div>
  );
};

export default TaskList;
