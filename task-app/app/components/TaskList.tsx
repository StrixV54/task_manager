"use client"

import { useMemo, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { useTaskContext } from '../context/TaskContext'
import TaskItem from './TaskItem'
import { AnimatePresence } from 'framer-motion'

const TaskList = () => {
  const { filteredTasks, toggleTask, deleteTask, reorderTasks, setIsDragging } = useTaskContext()

  // Memoize handlers for better performance
  const handleToggle = useCallback((id: string) => {
    toggleTask(id)
  }, [toggleTask])

  const handleDelete = useCallback((id: string) => {
    deleteTask(id)
  }, [deleteTask])

  const handleDragStart = useCallback(() => {
    // Set dragging state to true to disable animations
    setIsDragging(true)

    // Add a class to the body for global styling during drag
    if (typeof document !== 'undefined') {
      document.body.classList.add('dragging-active')
    }
  }, [setIsDragging])

  const handleDragEnd = useCallback((result: DropResult) => {
    // Set dragging state to false to re-enable animations
    setIsDragging(false)

    // Remove the global class
    if (typeof document !== 'undefined') {
      document.body.classList.remove('dragging-active')
    }

    // Dropped outside the list
    if (!result.destination) return

    reorderTasks(result.source.index, result.destination.index)
  }, [reorderTasks, setIsDragging])

  // Memoize task items to prevent unnecessary re-renders
  const taskItems = useMemo(() => (
    filteredTasks.map((task, index) => (
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              // Add transition for smooth movement, but not during drag to prevent shakiness
              transition: snapshot.isDragging
                ? 'none' // No transition during drag to prevent shakiness
                : 'transform 0.2s ease-out', // Smooth transition when released
              // Fix height to prevent layout shifts during drag
              height: snapshot.isDragging ? 'auto' : undefined,
              // Add a stronger transform for more stability
              transform: provided.draggableProps.style?.transform,
              // Increase z-index when dragging to ensure item stays on top
              zIndex: snapshot.isDragging ? 1000 : 1
            }}
            className={`mb-2 ${snapshot.isDragging ? 'dragging' : ''}`}
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
    <DragDropContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Droppable
        droppableId="tasks"
        isDropDisabled={false}
        renderClone={(provided, snapshot, rubric) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              transform: provided.draggableProps.style?.transform,
              height: 'auto'
            }}
          >
            {filteredTasks[rubric.source.index] && (
              <TaskItem
                task={filteredTasks[rubric.source.index]}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mt-6 space-y-1"
          >
            <AnimatePresence mode="wait">
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
