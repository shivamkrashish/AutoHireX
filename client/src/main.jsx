import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
// import {motionConfig} from 'motion/react' // ❌ यह सिंटैक्स एरर दे रहा था

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      {/* ❌ motionConfig कंपोनेंट को हटा दिया गया */}
      <App />
    </AppProvider>
  </BrowserRouter>,
)