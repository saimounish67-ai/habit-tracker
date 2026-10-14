import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { HabitProvider } from './context/HabitContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <HabitProvider>
        <App />
      </HabitProvider>
    </ThemeProvider>
  </StrictMode>,
)
