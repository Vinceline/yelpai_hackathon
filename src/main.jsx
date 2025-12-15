import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/controls.css";
import "./styles/nav.css";
import "./styles/map.css";
import "./styles/results.css";
import "./styles/chat-bubble.css";
import "./styles/accessibility.css";
import './styles/header.css';
import './styles/footer.css';


import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
