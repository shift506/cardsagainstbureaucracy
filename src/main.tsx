import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MotionProvider } from '@/animations/motion.config'
import { LandingPage } from '@/pages/LandingPage'
import { ChallengePage } from '@/pages/ChallengePage'
import { AgendaPage } from '@/pages/AgendaPage'
import { DrawPage } from '@/pages/DrawPage'
import { DeliberationPage } from '@/pages/DeliberationPage'
import { SynthesisPage } from '@/pages/SynthesisPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/session/challenge" element={<ChallengePage />} />
          <Route path="/session/agenda" element={<AgendaPage />} />
          <Route path="/session/draw" element={<DrawPage />} />
          <Route path="/session/deliberation" element={<DeliberationPage />} />
          <Route path="/session/synthesis" element={<SynthesisPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MotionProvider>
  </React.StrictMode>,
)
