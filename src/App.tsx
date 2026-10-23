import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppRoutes } from './routes/AppRoutes'
import { ScrollToPage } from './routes/ScrollToPage'
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToPage />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
