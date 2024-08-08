import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/taskSlice';
import axios from 'axios';

const TaskLogging = () => {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleAddTask = async () => {
    if (!task.trim()) {
      setError('Task cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/tasks', { name: task, completed: false });
      console.log('Task added:', response.data);
      dispatch(addTask(response.data));
      setTask(''); // Clear the input after successful addition
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Task Logging</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task"
        disabled={loading}
      />
      <button onClick={handleAddTask} disabled={loading}>
        {loading ? 'Adding Task...' : 'Add Task'}
      </button>
    </div>
  );
};

export default TaskLogging;
