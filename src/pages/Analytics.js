import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCompletedTasks } from '../redux/analyticsSlice';

const Analytics = () => {
  const dispatch = useDispatch();
  const { completedTasks, averageCompletionTime, loading, error } = useSelector(state => state.analytics);

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  useEffect(() => {
    dispatch(fetchCompletedTasks());
  }, [dispatch]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = completedTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading analytics...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Analytics</h2>
      <p>Total Tasks Completed: {completedTasks.length}</p>
      <p>Average Completion Time: {averageCompletionTime.toFixed(2)} minutes</p>

      <h3>Completed Tasks</h3>
      <ul>
        {currentTasks.map(task => (
          <li key={task.id}>{task.name} - Completed in {task.completedAt}</li>
        ))}
      </ul>

      <div className="pagination">
        {Array.from({ length: Math.ceil(completedTasks.length / tasksPerPage) }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
