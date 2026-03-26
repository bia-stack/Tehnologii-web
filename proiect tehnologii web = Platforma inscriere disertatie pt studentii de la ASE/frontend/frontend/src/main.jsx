import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//primul elem care ruleaza cand pornesti pagina,se duce in index.html si cauta root,unde va contrui siteul
createRoot(document.getElementById('root')).render(
  <StrictMode> {/*verifica daca ai scris gresit cod si te atentioneaza*/}
    <App /> {/*aici este afisat continutul fiecarei pagini*/}
  </StrictMode>,
)
