"use client"

import { useState, memo } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react'
import { Task } from '../context/TaskContext'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    // Delay actual deletion to allow animation to complete
    setTimeout(() => {
      onDelete(task.id)
    }, 300)
  }

  // Format the date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(task.createdAt)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDeleting ? 0 : 1,
        y: isDeleting ? -20 : 0,
        height: isDeleting ? 0 : 'auto'
      }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-4 mb-2 border rounded-lg bg-card text-card-foreground shadow-sm transition-all group dark:border-gray-700"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Checkbox
          id={task.id}
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="transition-all data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <label
            htmlFor={task.id}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer transition-all",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.text}
          </label>
          <span className="text-xs text-muted-foreground mt-1">{formattedDate}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash className="h-4 w-4 text-destructive" />
      </Button>
    </motion.div>
  )
}

// Using memo for performance optimization
export default memo(TaskItem)
