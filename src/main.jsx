import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: '#2C2C2A', color: '#fff', fontSize: '13px', borderRadius: '20px' },
          success: { iconTheme: { primary: '#639922', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#D85A30', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
