import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import './diagram.css'
import './tacticalBoard.css'
import './teamWizard.css'
import './crest.css'
import './dashboard.css'
import './playersHub.css'
import './sessionPlanner.css'
import './sessionPlannerConcept.css'
import './onboarding.css'
import './onboardingPolish.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
