import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/birth-form-pro.css'
import './styles/mystic-cosmic.css'
import './styles/mystic-polish.css'
import './styles/cosmic-theme.css'
import './styles/pro-ui.css'
import './styles/pro-premium.css'
import './styles/motion-fonts.css'
import './styles/interaction-effects.css'
import './styles/home-hero-polish.css'
import './styles/cinematic-intro.css'
import App from './App.tsx'

document.documentElement.classList.add('hora-fonts-active')
void document.fonts?.ready?.then(() => {
  document.documentElement.classList.add('fonts-loaded')
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,

)

