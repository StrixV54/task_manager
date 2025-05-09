"use client"

import { useMemo, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { useTaskContext } from '../context/TaskContext'
import TaskItem from './TaskItem'
import { AnimatePresence } from 'framer-motion'

const TaskList = () => {
  const { filteredTasks, toggleTask, deleteTask, reorderTasks } = useTaskContext()

  // Memoize handlers for better performance
  const handleToggle = useCallback((id: string) => {
    toggleTask(id)
  }, [toggleTask])

  const handleDelete = useCallback((id: string) => {
    deleteTask(id)
  }, [deleteTask])

  const handleDragEnd = useCallback((result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) return

    reorderTasks(result.source.index, result.destination.index)
  }, [reorderTasks])

  // Memoize task items to prevent unnecessary re-renders
  const taskItems = useMemo(() => (
    filteredTasks.map((task, index) => (
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <TaskItem
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          </div>
        )}
      </Draggable>
    ))
  ), [filteredTasks, handleToggle, handleDelete])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mt-6 space-y-1"
          >
            <AnimatePresence>
              {taskItems}
            </AnimatePresence>
            {provided.placeholder}
            {filteredTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tasks found. Add a new task to get started.
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default TaskList
