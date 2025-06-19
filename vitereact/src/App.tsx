import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './components/ui/select';
import { Label } from './components/ui/label';
import { Alert, AlertDescription } from './components/ui/alert';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

type SortOption = 'created' | 'priority' | 'alphabetical';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [error, setError] = useState<string>('');

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (newTask.trim().length < 3) {
      setError('Task title must be at least 3 characters long');
      return;
    }
    setError('');
    setTasks([...tasks, {
      id: Date.now(),
      title: newTask,
      status: 'pending',
      priority: newTaskPriority,
      createdAt: new Date()
    }]);
    setNewTask('');
  };

  const sortTasks = (tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const filteredTasks = sortTasks(
    tasks.filter(task => {
      if (filter === 'all') return true;
      return task.status === filter;
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
            <div className="flex gap-4">
              <Button variant="ghost" className="hover:bg-gray-100">
                <span className="material-icons mr-2">dashboard</span>
                Dashboard
              </Button>
              <Button variant="ghost" className="hover:bg-gray-100">
                <span className="material-icons mr-2">settings</span>
                Settings
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Task Creation Form */}
        <Card className="p-6 mb-8">
          <form onSubmit={(e) => { e.preventDefault(); addTask(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-task">New Task</Label>
              <div className="flex gap-4">
                <Input
                  id="new-task"
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-grow"
                  aria-label="New task input"
                  required
                  minLength={3}
                />
                <Select value={newTaskPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTaskPriority(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">Add Task</Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </Card>

        {/* Task Controls */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="flex gap-4">
            <div>
              <Label htmlFor="filter">Filter</Label>
              <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'completed') => setFilter(value)}>
                <SelectTrigger id="filter" className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger id="sort" className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Creation Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredTasks.length} task(s) • {tasks.filter(t => t.status === 'completed').length} completed
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              No tasks found. Create a new task to get started!
            </Card>
          ) : (
            filteredTasks.map(task => (
              <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-grow">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5"
                      aria-label={`Mark ${task.title} as ${task.status === 'completed' ? 'pending' : 'completed'}`}
                    />
                    <div className="flex flex-col">
                      <span className={`text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        Created {new Date(task.createdAt).toLocaleDateString()} • 
                        Priority: <span className={`font-medium ${
                          task.priority === 'high' ? 'text-red-500' :
                          task.priority === 'medium' ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>{task.priority}</span>
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    className="ml-4"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))
          )}
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