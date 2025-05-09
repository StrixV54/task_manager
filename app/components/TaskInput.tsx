"use client"

import { useState, useCallback, KeyboardEvent } from 'react'
import { useTaskContext } from '../context/TaskContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const TaskInput = () => {
  const { addTask } = useTaskContext()
  const [taskText, setTaskText] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskText(e.target.value)
    if (error && e.target.value.trim()) {
      setError('')
    }
  }, [error])

  const handleSubmit = useCallback(() => {
    if (!taskText.trim()) {
      setError('Task cannot be empty')
      return
    }

    addTask(taskText)
    setTaskText('')
    setError('')
  }, [taskText, addTask])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={taskText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="flex-1"
          aria-label="Task input"
        />
        <Button onClick={handleSubmit} type="submit">
          <PlusCircle className="h-4 w-4" />
          Add
        </Button>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default TaskInput
