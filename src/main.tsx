import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
import { MotionProvider } from '@/animations/motion.config'
import { PasswordGate } from '@/components/PasswordGate/PasswordGate'
import { LandingPage } from '@/pages/LandingPage'
import { ChallengePage } from '@/pages/ChallengePage'
import { AgendaPage } from '@/pages/AgendaPage'
import { DrawPage } from '@/pages/DrawPage'
import { DeliberationPage } from '@/pages/DeliberationPage'
import { SynthesisPage } from '@/pages/SynthesisPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionProvider>
      <PasswordGate>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/session/challenge" element={<ChallengePage />} />
          <Route path="/session/agenda" element={<AgendaPage />} />
          <Route path="/session/draw" element={<DrawPage />} />
          <Route path="/session/deliberation" element={<DeliberationPage />} />
          <Route path="/session/synthesis" element={<SynthesisPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </PasswordGate>
    </MotionProvider>
  </React.StrictMode>,
)
