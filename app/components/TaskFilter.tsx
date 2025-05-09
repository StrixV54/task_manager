"use client"

import { useCallback } from 'react'
import { useTaskContext } from '../context/TaskContext'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FilterButton = ({
  label,
  active,
  onClick
}: {
  label: string,
  active: boolean,
  onClick: () => void
}) => (
  <Button
    variant={active ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    className={cn(
      "transition-all",
      active && "bg-primary text-primary-foreground"
    )}
  >
    {label}
  </Button>
)

const TaskFilter = () => {
  const { filterType, setFilterType, tasks } = useTaskContext()

  const handleFilterChange = useCallback((filter: 'all' | 'completed' | 'pending') => {
    setFilterType(filter)
  }, [setFilterType])

  // Get counts for the badges
  const completedCount = tasks.filter(task => task.completed).length
  const pendingCount = tasks.filter(task => !task.completed).length

  return (
    <div className="flex items-center justify-between mt-6 mb-4">
      <p className="text-sm text-muted-foreground">
        {tasks.length} total tasks • {completedCount} completed • {pendingCount} pending
      </p>

      <div className="flex space-x-2 overflow-x-auto">
        <FilterButton
          label="All"
          active={filterType === 'all'}
          onClick={() => handleFilterChange('all')}
        />
        <FilterButton
          label="Completed"
          active={filterType === 'completed'}
          onClick={() => handleFilterChange('completed')}
        />
        <FilterButton
          label="Pending"
          active={filterType === 'pending'}
          onClick={() => handleFilterChange('pending')}
        />
      </div>
    </div>
  )
}

export default TaskFilter
