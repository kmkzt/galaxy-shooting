import { createRoot } from 'react-dom/client'
import App from './App'

const app = document.getElementById('app')
if (app) {
  createRoot(app).render(<App />)
}
