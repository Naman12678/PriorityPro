import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/tasksSlice';
import { PlusCircle, Zap, Layers, Anchor } from 'lucide-react';

const TaskInput = () => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(
      addTask({
        title: title.trim(),
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
      })
    );

    setTitle('');
    setPriority('medium');
    setIsExpanded(false);
  };

  // Priority icon mapping
  const priorityIcons = {
    low: <Anchor size={20} className="text-green-500" />,
    medium: <Layers size={20} className="text-yellow-500" />,
    high: <Zap size={20} className="text-red-500" />
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <form 
        onSubmit={handleSubmit} 
        className={`
          rounded-2xl shadow-lg transition-all duration-300 ease-in-out
          ${isExpanded ? 'p-6 space-y-4' : 'p-4'}
          bg-white text-gray-800 border border-gray-300
        `}
      >
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task..."
              onFocus={() => setIsExpanded(true)}
              className={`
                w-full px-4 py-3 rounded-lg border 
                transition duration-200 ease-in-out
                bg-gray-100 text-gray-800 border-gray-300
                focus:ring-2 focus:ring-blue-500 focus:border-blue-600 focus:outline-none
              `}
            />
            {isExpanded && (
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Priority:</span>
                  {Object.entries(priorityIcons).map(([level, icon]) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className={`
                        p-1 rounded-full transition duration-200 ease-in-out
                        ${priority === level 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-100'}
                      `}
                    >
                      {icon}
                      <span className="sr-only">{level} priority</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2 w-full sm:w-auto">
            {isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-3 rounded-lg transition duration-200 text-gray-800 hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!title.trim()}
              className={`
                w-full sm:w-auto px-6 py-3 
                rounded-lg focus:outline-none 
                flex items-center justify-center gap-2
                transition duration-200 ease-in-out
                transform hover:scale-105 active:scale-95
                bg-blue-500 text-white hover:bg-blue-400
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <PlusCircle size={20} />
              Add Task
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskInput;
