import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Home } from '../pages/Home'
import { AuthPage } from '../pages/AuthPage'
import { Account, Loading, SessionProblem, Workspace } from '../pages/Account'
import { useAuth } from '../contexts/AuthContext'
import type { Role } from '../types/user'

function RequireAuth() {
  const { loading, user, error } = useAuth()
  if (loading) return <Loading />
  if (!user) return <Navigate to="/entrar" replace />
  if (error) return <SessionProblem />
  return <Outlet />
}
function RequireRole({ role }: { role: Role | 'admin' }) {
  const { profile, admin } = useAuth()
  if (role === 'admin' ? admin : profile?.roles.includes(role)) return <Outlet />
  if (!profile && !admin) return <Navigate to="/conta" replace />
  return (
    <section className="container status-screen">
      <h1>Acesso restrito</h1>
      <p>Sua conta não possui permissão para este ambiente.</p>
      <Link className="button" to="/conta">
        Voltar à minha conta
      </Link>
    </section>
  )
}
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="entrar" element={<AuthPage key="login" mode="login" />} />
        <Route path="cadastrar" element={<AuthPage key="register" mode="register" />} />
        <Route path="recuperar-senha" element={<AuthPage key="reset" mode="reset" />} />
        <Route element={<RequireAuth />}>
          <Route path="conta" element={<Account />} />
          {(
            [
              { path: 'cliente', role: 'client' },
              { path: 'profissional', role: 'professional' },
              { path: 'admin', role: 'admin' },
            ] as const
          ).map(({ path, role }) => (
            <Route key={path} element={<RequireRole role={role} />}>
              <Route path={path} element={<Workspace key={role} area={role} />} />
            </Route>
          ))}
        </Route>
        <Route
          path="*"
          element={
            <section className="container status-screen">
              <h1>Página não encontrada</h1>
              <Link className="button" to="/">
                Voltar ao início
              </Link>
            </section>
          }
        />
      </Route>
    </Routes>
  )
}
