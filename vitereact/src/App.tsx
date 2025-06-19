import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';
import { Select } from './components/ui/select';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'completed';
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTask, status: 'pending' }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Task Creation */}
        <div className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            aria-label="New task input"
          />
          <Button onClick={addTask}>Add Task</Button>
        </div>

        {/* Task Filtering */}
        <div className="mb-6">
          <select
            className="border rounded p-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
            aria-label="Filter tasks"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <Card key={task.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`Mark ${task.title} as ${task.status === 'completed' ? 'pending' : 'completed'}`}
                  />
                  <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                    {task.title}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.title}`}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600">
          <p>Task Management App - Organize your tasks efficiently</p>
        </div>
      </footer>
    </div>
  );
}

export default App;