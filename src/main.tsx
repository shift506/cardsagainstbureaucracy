import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionProvider } from '@/animations/motion.config'
import { HomePage } from '@/pages/HomePage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionProvider>
      <HomePage />
    </MotionProvider>
  </React.StrictMode>,
)
