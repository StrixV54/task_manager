"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

interface TaskContextType {
  tasks: Task[]
  addTask: (text: string) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  filterType: 'all' | 'completed' | 'pending'
  setFilterType: (filter: 'all' | 'completed' | 'pending') => void
  filteredTasks: Task[]
  darkMode: boolean
  toggleDarkMode: () => void
  reorderTasks: (startIndex: number, endIndex: number) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'pending'>('all')
  const [darkMode, setDarkMode] = useState(false)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks)
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }))
        setTasks(tasksWithDates)
      } catch (error) {
        console.error('Failed to parse tasks from localStorage', error)
      }
    }

    // Load theme preference
    const storedTheme = localStorage.getItem('darkMode')
    if (storedTheme) {
      setDarkMode(storedTheme === 'true')
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const addTask = useCallback((text: string) => {
    if (!text.trim()) return
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    }
    setTasks(prevTasks => [...prevTasks, newTask])
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev)
  }, [])

  const reorderTasks = useCallback((startIndex: number, endIndex: number) => {
    setTasks(prevTasks => {
      const result = Array.from(prevTasks)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }, [])

  // Filter tasks based on the current filter type
  const filteredTasks = tasks.filter(task => {
    if (filterType === 'all') return true
    if (filterType === 'completed') return task.completed
    if (filterType === 'pending') return !task.completed
    return true
  })

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        toggleTask,
        filterType,
        setFilterType,
        filteredTasks,
        darkMode,
        toggleDarkMode,
        reorderTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
