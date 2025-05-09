"use client"

import { useTaskContext } from '../context/TaskContext'
import { Sun, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTaskContext()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="relative"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: darkMode ? 360 : 0,
          opacity: darkMode ? 0 : 1,
          scale: darkMode ? 0.5 : 1
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Sun className="h-5 w-5" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          rotate: darkMode ? 0 : -360,
          opacity: darkMode ? 1 : 0,
          scale: darkMode ? 1 : 0.5
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Moon className="h-5 w-5" />
      </motion.div>
    </Button>
  )
}

export default ThemeToggle
