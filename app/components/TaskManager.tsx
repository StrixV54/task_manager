"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TaskInput from './TaskInput'
import TaskList from './TaskList'
import TaskFilter from './TaskFilter'
import ThemeToggle from './ThemeToggle'

const TaskManager = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-2xl mx-auto p-4"
    >
      <Card className="shadow-lg border-t-4 border-t-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Task Manager</CardTitle>
          <ThemeToggle />
        </CardHeader>

        <CardContent className="space-y-4">
          <TaskInput />
          <TaskFilter />
          <TaskList />
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Built by Shrikant • 2025</p>
      </footer>
    </motion.div>
  )
}

export default TaskManager
