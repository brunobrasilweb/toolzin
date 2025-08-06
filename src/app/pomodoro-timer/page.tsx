"use client";

import { useState, useEffect, useRef } from "react";
import { Timer as TimerIcon, Play, Pause, RotateCcw, Check, Plus, Trash2, BarChart4, Bell, Clock, Volume2, VolumeX } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
            clearInterval(timerRef.current!);
            // Handle timer completion
            if (timerType === 'pomodoro') {
              // Record completed pomodoro
              if (selectedTaskId) {
                const now = new Date().toISOString();
                // Add session record
                setSessions(prev => [...prev, {
                  taskId: selectedTaskId,
                  date: now.split('T')[0],
                  duration: POMODORO_TIME
                }]);
                
                // Update task pomodoro count
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
              }
              
              // Increment pomodoro count
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
            } else {
              // After break, go back to pomodoro
              setTimerType('pomodoro');
              setTimeLeft(POMODORO_TIME);
              
              // Show alert and play sound
              setAlertMessage(`Break completed! Time to focus again.`);
              setShowAlert(true);
              // Start repeating sound notification
              startRepeatingSound();
            }
            
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, timerType, selectedTaskId]);

  // Stats chart
  useEffect(() => {
    if (showStats) {
      updateChart();
    }
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
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
      
      const task = tasks.find(t => t.id === session.taskId);
      const taskName = task ? task.title : 'Unknown Task';
      
      acc[session.date][taskName] = (acc[session.date][taskName] || 0) + session.duration;
      return acc;
    }, {});
    
    // Sort dates
    const dates = Object.keys(sessionsByDate).sort();
    
    // Get all unique task names
    const allTaskNames = new Set<string>();
    Object.values(sessionsByDate).forEach(dateTasks => {
      Object.keys(dateTasks).forEach(taskName => allTaskNames.add(taskName));
    });
    
    const taskNames = Array.from(allTaskNames);
    
    // Create datasets for each task
    const datasets = taskNames.map((taskName, index) => {
      const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ];
      
      return {
        label: taskName,
        data: dates.map(date => {
          const minutes = sessionsByDate[date][taskName] 
            ? Math.round(sessionsByDate[date][taskName] / 60) 
            : 0;
          return minutes;
        }),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace('0.7', '1'),
        borderWidth: 1
      };
    });
    
    // Create chart
    const ctx = chartCanvasRef.current.getContext('2d') as ChartItem;
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets
      },
      options: {
        responsive: true,
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
          title: {
            display: true,
            text: 'Your Pomodoro Progress'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            position: 'top',
          }
        }
      }
    });
  };

  // Helper functions
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      totalPomodoros: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      completed: false
    };
    
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle("");
    setSelectedTaskId(newTask.id);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
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
          <div className="flex items-center justify-center mb-4">
            <TimerIcon className="h-10 w-10 text-orange-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Pomodoro Timer
            </h1>
          </div>
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
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg px-3 transition-colors duration-200 flex items-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {/* Task list */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
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
                        className={`${
                          task.completed 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                        } p-1 rounded-lg hover:bg-opacity-80 transition-colors`}
                        title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 p-1 rounded-lg hover:bg-opacity-80 transition-colors"
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
          
          {/* Right panel - Timer and Stats */}
          <div className="lg:col-span-8 space-y-8">
            {/* Timer */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <button
                  onClick={() => changeTimerType('pomodoro')}
                  className={`px-4 py-2 rounded-lg ${
                    timerType === 'pomodoro'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  Pomodoro
                </button>
                
                <button
                  onClick={() => changeTimerType('shortBreak')}
                  className={`px-4 py-2 rounded-lg ${
                    timerType === 'shortBreak'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  Short Break
                </button>
                
                <button
                  onClick={() => changeTimerType('longBreak')}
                  className={`px-4 py-2 rounded-lg ${
                    timerType === 'longBreak'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  Long Break
                </button>
                
                {isMuted && (
                  <div className="ml-2 text-red-500 dark:text-red-400 flex items-center text-xs py-2">
                    <VolumeX className="h-4 w-4 mr-1" />
                    <span>Sound Muted</span>
                  </div>
                )}
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
                          (1 - timeLeft / (timerType === 'pomodoro' 
                            ? POMODORO_TIME 
                            : timerType === 'shortBreak' 
                              ? SHORT_BREAK_TIME 
                              : LONG_BREAK_TIME))
                        }
                        transform="rotate(-90 128 128)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-gray-900 dark:text-white">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {timerType === 'pomodoro' 
                    ? 'Focus time' 
                    : timerType === 'shortBreak' 
                      ? 'Short break' 
                      : 'Long break'}
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={handleStartPause}
                  className={`px-6 py-3 rounded-lg flex items-center ${
                    isTimerRunning
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  } transition-colors duration-200`}
                  disabled={timerType === 'pomodoro' && !selectedTaskId}
                >
                  {isTimerRunning 
                    ? <><Pause className="mr-2 h-5 w-5" /> Pause</> 
                    : <><Play className="mr-2 h-5 w-5" /> Start</>}
                </button>
                
                <button
                  onClick={handleResetTimer}
                  className="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center transition-colors duration-200"
                >
                  <RotateCcw className="mr-2 h-5 w-5" /> Reset
                </button>
                
                <button
                  onClick={toggleMute}
                  className={`px-3 py-3 rounded-lg ${
                    isMuted
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } transition-colors duration-200`}
                  title={isMuted ? "Unmute notifications" : "Mute notifications"}
                >
                  {isMuted 
                    ? <VolumeX className="h-5 w-5" /> 
                    : <Volume2 className="h-5 w-5" />}
                </button>
              </div>
              
                {timerType === 'pomodoro' && !selectedTaskId && (
                <div className="mt-4 text-center text-amber-600 dark:text-amber-400">
                  Please select a task before starting the timer
                </div>
              )}
            </div>
            
            {/* Selected Task */}
            {selectedTaskId && timerType === 'pomodoro' && (
              <div className="mt-3 p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="text-center">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    Current Task:
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 break-words text-sm">
                    {tasks.find(t => t.id === selectedTaskId)?.title}
                  </p>
                </div>
              </div>
            )}            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Statistics
                </h2>
                
                <button
                  onClick={toggleStats}
                  className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400 p-2 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-200 flex items-center"
                >
                  <BarChart4 className="h-5 w-5" />
                  <span className="ml-2">{showStats ? 'Hide Chart' : 'Show Chart'}</span>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-6 justify-around mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">{pomodoroCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pomodoros Today</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {tasks.filter(t => t.completed).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Minutes</div>
                </div>
              </div>
              
              {showStats && (
                <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <canvas ref={chartCanvasRef} />
                </div>
              )}
              
              {showStats && sessions.length === 0 && (
                <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                  Complete some pomodoros to see your progress chart
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
