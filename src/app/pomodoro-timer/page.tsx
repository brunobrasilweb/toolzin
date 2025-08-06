"use client";

import { useState, useEffect, useRef } from "react";
import { Timer as TimerIcon, Play, Pause, RotateCcw, Check, Plus, Trash2, BarChart4, Bell, Clock, Volume2, VolumeX } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolIcons } from "@/components/ToolIcons";
import { Chart, ChartItem, registerables } from 'chart.js';
import { useNotificationSound } from './useNotificationSound';
import './animations.css';
Chart.register(...registerables);

// Define types for our data
interface Task {
  id: string;
  title: string;
  totalPomodoros: number;
  createdAt: string;
  lastUpdated: string;
  completed: boolean;
}

interface PomodoroSession {
  taskId: string;
  date: string;
  duration: number;
}

const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
const LONG_BREAK_TIME = 15 * 60; // 15 minutes in seconds

export default function PomodoroTimer() {
  // State variables
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerType, setTimerType] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const { startRepeatingSound, stopRepeatingSound, isMuted, toggleMute } = useNotificationSound();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('pomodoro-tasks');
    const savedSessions = localStorage.getItem('pomodoro-sessions');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pomodoro-sessions', JSON.stringify(sessions));
    
    // Update chart when sessions change and stats are shown
    if (showStats) {
      updateChart();
    }
  }, [sessions, showStats]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Record completed session if it's a pomodoro
            if (timerType === 'pomodoro' && selectedTaskId) {
              const now = new Date().toISOString().split('T')[0];
              
              // Add session to sessions list
              setSessions(prev => [
                ...prev,
                {
                  taskId: selectedTaskId,
                  date: now,
                  duration: POMODORO_TIME / 60 // Duration in minutes
                }
              ]);
              
              // Update task's pomodoro count
              setTasks(prev => prev.map(task => 
                task.id === selectedTaskId 
                  ? { ...task, totalPomodoros: task.totalPomodoros + 1, lastUpdated: now }
                  : task
              ));
              
              // Show alert and play sound
              const taskName = tasks.find(t => t.id === selectedTaskId)?.title || 'Task';
              setAlertMessage(`Pomodoro completed for "${taskName}"!`);
              setShowAlert(true);
              // Start repeating sound notification
              startRepeatingSound();
              
              // Se estiver mudo, mostre um console.log (para debug)
              if (isMuted) {
                console.log('Timer completed but notifications are muted');
              }
            } else if (timerType !== 'pomodoro') {
              // After break, go back to pomodoro
              setTimerType('pomodoro');
              setTimeLeft(POMODORO_TIME);
              
              // Show alert and play sound
              setAlertMessage(`Break completed! Time to focus again.`);
              setShowAlert(true);
              // Start repeating sound notification
              startRepeatingSound();
            }
            
            // Increment pomodoro count and set next timer type
            if (timerType === 'pomodoro') {
              setPomodoroCount(prev => {
                const newCount = prev + 1;
                // After 4 pomodoros, suggest a long break
                if (newCount % 4 === 0) {
                  setTimerType('longBreak');
                  setTimeLeft(LONG_BREAK_TIME);
                } else {
                  setTimerType('shortBreak');
                  setTimeLeft(SHORT_BREAK_TIME);
                }
                return newCount;
              });
            }
            
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, timerType, selectedTaskId, tasks]);

// Update chart when statistics tab is shown
useEffect(() => {
  if (showStats) {
    // Update chart on next tick to ensure canvas is mounted
    setTimeout(() => {
      updateChart();
    }, 0);
  }
}, [showStats]);

// Cleanup notification sounds when component unmounts
useEffect(() => {
  return () => {
    // Pare qualquer som quando o componente for desmontado
    stopRepeatingSound();
  };
}, []);

// Ensure sound stops if alert is hidden for any reason
useEffect(() => {
  if (!showAlert) {
    stopRepeatingSound();
  }
}, [showAlert]);

const updateChart = () => {
  if (!chartCanvasRef.current || !showStats) return;
  
  // Destroy existing chart
  if (chartRef.current) {
    chartRef.current.destroy();
  }
  
  // Group sessions by date and calculate total duration
  const sessionsByDate = sessions.reduce<Record<string, Record<string, number>>>((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = {};
    }
    
    const taskTitle = tasks.find(t => t.id === session.taskId)?.title || 'Unknown Task';
    
    if (!acc[session.date][taskTitle]) {
      acc[session.date][taskTitle] = 0;
    }
    
    acc[session.date][taskTitle] += session.duration;
    
    return acc;
  }, {});
  
  // Convert to chart data
  const dates = Object.keys(sessionsByDate).sort();
  
  // Find all unique task names
  const taskNames = new Set<string>();
  dates.forEach(date => {
    Object.keys(sessionsByDate[date]).forEach(task => {
      taskNames.add(task);
    });
  });
  
  // Convert to array and generate colors
  const allTaskNames = Array.from(taskNames);
  const colors = generateColors(allTaskNames.length);
  
  // Create datasets
  const datasets = allTaskNames.map((task, index) => {
    return {
      label: task,
      data: dates.map(date => sessionsByDate[date][task] || 0),
      backgroundColor: colors[index],
      borderColor: colors[index],
      borderWidth: 1
    };
  });
  
  // Create the chart
  chartRef.current = new Chart(chartCanvasRef.current as ChartItem, {
    type: 'bar',
    data: {
      labels: dates,
      datasets: datasets
    },
    options: {
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Minutes'
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Pomodoro Statistics'
        }
      }
    }
  });
};

// Function to generate random colors for chart
const generateColors = (count: number) => {
  const baseColors = [
    'rgba(255, 99, 132, 0.7)',  // Red
    'rgba(54, 162, 235, 0.7)',  // Blue
    'rgba(255, 206, 86, 0.7)',  // Yellow
    'rgba(75, 192, 192, 0.7)',  // Green
    'rgba(153, 102, 255, 0.7)', // Purple
    'rgba(255, 159, 64, 0.7)',  // Orange
  ];
  
  // If we need more colors than in our base set, generate them
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  const colors = [...baseColors];
  
  for (let i = baseColors.length; i < count; i++) {
    // Generate random RGBA
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
  }
  
  return colors;
};

// Format seconds as MM:SS
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const handleAddTask = () => {
  if (newTaskTitle.trim() === "") return;
  
  const now = new Date().toISOString().split('T')[0];
  
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: newTaskTitle.trim(),
    totalPomodoros: 0,
    createdAt: now,
    lastUpdated: now,
    completed: false
  };
  
  setTasks(prev => [...prev, newTask]);
  setNewTaskTitle("");
  
  // If no task is selected, select the new one
  if (!selectedTaskId) {
    setSelectedTaskId(newTask.id);
  }
};

const handleDeleteTask = (id: string) => {
  setTasks(prev => prev.filter(task => task.id !== id));
  
  // If we're deleting the selected task, unselect it
  if (selectedTaskId === id) {
    setSelectedTaskId(null);
  }
};

const handleCompleteTask = (id: string) => {
  setTasks(prev => prev.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  ));
};

const handleResetTimer = () => {
  if (isTimerRunning) {
    setIsTimerRunning(false);
  }
  
  switch (timerType) {
    case 'pomodoro':
      setTimeLeft(POMODORO_TIME);
      break;
    case 'shortBreak':
      setTimeLeft(SHORT_BREAK_TIME);
      break;
    case 'longBreak':
      setTimeLeft(LONG_BREAK_TIME);
      break;
  }
};

const handleStartPause = () => {
  setIsTimerRunning(prev => !prev);
};

const changeTimerType = (type: 'pomodoro' | 'shortBreak' | 'longBreak') => {
  if (isTimerRunning) {
    setIsTimerRunning(false);
  }
  
  setTimerType(type);
  
  switch (type) {
    case 'pomodoro':
      setTimeLeft(POMODORO_TIME);
      break;
    case 'shortBreak':
      setTimeLeft(SHORT_BREAK_TIME);
      break;
    case 'longBreak':
      setTimeLeft(LONG_BREAK_TIME);
      break;
  }
};

const toggleStats = () => {
  setShowStats(prev => !prev);
};

// Handle alert dismissal
const dismissAlert = () => {
  console.log('Dismissing alert and stopping sound');
  stopRepeatingSound(); // Pare o som primeiro
  setShowAlert(false); // Então esconda o alerta
};

// Auto-hide alert was removed since we want it to stay until dismissed

return (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
    <Header />
    
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Alert notification */}
      {showAlert && (
        <div className="fixed top-20 right-4 max-w-sm bg-white dark:bg-gray-800 border-l-4 border-orange-500 rounded-lg shadow-lg p-4 z-50 animate-fadeIn">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {isMuted ? 
                <VolumeX className="h-5 w-5 text-red-500" /> :
                <Bell className="h-5 w-5 text-orange-500" />
              }
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">
                {alertMessage}
                {isMuted && <span className="text-xs text-red-500 ml-2">(Notifications muted)</span>}
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={dismissAlert}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
                >
                  OK
                </button>
                {isMuted && (
                  <button 
                    onClick={toggleMute}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
                  >
                    Unmute
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <ToolIcons.timer className="h-8 w-8 text-orange-600 dark:text-orange-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Pomodoro Timer
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Track your tasks and boost productivity with a customizable Pomodoro timer
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left panel - Tasks */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Tasks
          </h2>
          
          {/* Add task form */}
          <div className="flex items-stretch mb-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add task..."
              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <button
              onClick={handleAddTask}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg px-3 transition-colors"
              disabled={newTaskTitle.trim() === ""}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {/* Tasks list */}
          <div className="space-y-2 mt-4 max-h-96 overflow-y-auto pr-1">
            {tasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No tasks yet. Add one to get started!
              </p>
            ) : (
              tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`p-2 border rounded-lg transition-colors duration-200 ${
                    selectedTaskId === task.id 
                      ? 'bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div 
                      className="cursor-pointer flex-1"
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-2.5 h-2.5 rounded-full mr-2 ${selectedTaskId === task.id ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <h3 className={`font-medium text-gray-900 dark:text-white ${task.completed ? 'line-through' : ''} text-sm break-words`} title={task.title}>
                          {task.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 ml-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-1.5 py-0.5 flex items-center">
                        <Clock className="h-2.5 w-2.5 mr-0.5" />
                        {task.totalPomodoros}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-1 mt-1">
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className={`p-1 rounded ${
                        task.completed
                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      } hover:bg-gray-200 dark:hover:bg-gray-600`}
                      title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-red-500 dark:hover:text-red-400"
                      title="Delete task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Middle panel - Timer */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          {showStats ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Statistics
                </h2>
                <button
                  onClick={toggleStats}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-1 rounded-md"
                >
                  Back to Timer
                </button>
              </div>
              
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-grow text-gray-500 dark:text-gray-400">
                  <BarChart4 className="h-16 w-16 mb-4 opacity-50" />
                  <p>No data yet. Complete pomodoro sessions to see statistics.</p>
                </div>
              ) : (
                <div className="flex-grow">
                  <canvas 
                    ref={chartCanvasRef} 
                    className="w-full h-full"
                  ></canvas>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {selectedTaskId 
                    ? tasks.find(t => t.id === selectedTaskId)?.title 
                    : "Timer"
                  }
                </h2>
                <button
                  onClick={toggleStats}
                  className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-1 rounded-md"
                >
                  <BarChart4 className="h-4 w-4 mr-1" />
                  <span>Stats</span>
                </button>
              </div>
              
              <div className="text-center mb-8">
                <div className="relative">
                  <div className={`inline-flex items-center justify-center ${
                    timerType === 'pomodoro'
                      ? 'text-orange-500'
                      : timerType === 'shortBreak'
                        ? 'text-blue-500'
                        : 'text-green-500'
                  }`}>
                    <svg className="w-64 h-64">
                      <circle
                        className="stroke-current opacity-20"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="115"
                        cx="128"
                        cy="128"
                      />
                      <circle
                        className="stroke-current"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="115"
                        cx="128"
                        cy="128"
                        strokeDasharray={2 * Math.PI * 115}
                        strokeDashoffset={
                          2 * Math.PI * 115 *
                          (1 - timeLeft / (
                            timerType === 'pomodoro'
                              ? POMODORO_TIME
                              : timerType === 'shortBreak'
                                ? SHORT_BREAK_TIME
                                : LONG_BREAK_TIME
                          ))
                        }
                        transform="rotate(-90 128 128)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <div className="text-6xl font-bold">{formatTime(timeLeft)}</div>
                        <div className="text-sm mt-2 capitalize">
                          {timerType === 'pomodoro' ? 'Focus Time' : 
                           timerType === 'shortBreak' ? 'Short Break' : 'Long Break'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button
                    onClick={() => changeTimerType('pomodoro')}
                    className={`px-4 py-2 rounded-lg ${
                      timerType === 'pomodoro'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Pomodoro
                  </button>
                  <button
                    onClick={() => changeTimerType('shortBreak')}
                    className={`px-4 py-2 rounded-lg ${
                      timerType === 'shortBreak'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Short Break
                  </button>
                  <button
                    onClick={() => changeTimerType('longBreak')}
                    className={`px-4 py-2 rounded-lg ${
                      timerType === 'longBreak'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Long Break
                  </button>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={handleStartPause}
                    className={`flex items-center justify-center w-14 h-14 rounded-full ${
                      isTimerRunning
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-orange-500 hover:bg-orange-600'
                    } text-white`}
                  >
                    {isTimerRunning ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" />
                    )}
                  </button>
                  
                  <button
                    onClick={handleResetTimer}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-4 flex items-center">
                  <button
                    onClick={toggleMute}
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-1 rounded-md"
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="h-4 w-4 mr-1 text-red-500" />
                        <span className="text-sm text-red-500">Muted</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 mr-1" />
                        <span className="text-sm">Sound On</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
);
}
