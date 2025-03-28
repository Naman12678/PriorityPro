import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, clearError } from './store/authSlice';
import { fetchTasks } from './store/tasksSlice';
import Auth from './components/Auth';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import { LogOut } from 'lucide-react';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, username, error } = useSelector((state) => state.auth);
  const tasks = useSelector((state) => state.tasks.items);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTasks());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
  };

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PriorityPro </h1>
            <p className="text-lg text-gray-600">Welcome back!</p>
          </div>

          <div className="flex items-center gap-4">
          <button
  onClick={() => dispatch(logout())}
  className="
    px-4 py-2 rounded-lg flex items-center gap-2 
    transition duration-300 bg-red-600 text-white 
    hover:bg-red-700 focus:outline-none focus:ring-2 
    focus:ring-red-500 focus:ring-offset-2
    text-sm sm:text-base lg:text-lg 
    sm:px-4 lg:px-6 sm:py-3 lg:py-4
  "
>
  <LogOut size={20} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
  <span className="hidden sm:inline">Logout</span>
</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 text-gray-700">
          {Object.entries(taskStats).map(([key, value]) => (
            <div
              key={key}
              className="p-4 rounded-lg text-center bg-white shadow-sm"
            >
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm capitalize">{key} Tasks</div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <TaskInput />
          <TaskList />
        </div>
      </div>
    </div>
  );
}

export default App;
