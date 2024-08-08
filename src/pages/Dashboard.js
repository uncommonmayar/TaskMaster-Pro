import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, removeTask, toggleTaskCompletion } from '../redux/taskSlice';
import axios from 'axios';

const Dashboard = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCompleteTask = async (id) => {
    if (window.confirm('Are you sure you want to complete this task?')) {
      setLoading(true);
      setError(null);
      try {
        await axios.patch(`http://localhost:5000/api/tasks/${id}/complete`);
        dispatch(toggleTaskCompletion({ id }));
      } catch (error) {
        console.error('Error completing task', error);
        setError('Failed to complete task. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.name} 
            {!task.completed && (
              <button 
                onClick={() => handleCompleteTask(task.id)} 
                disabled={loading}
              >
                {loading ? 'Completing...' : 'Complete'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
