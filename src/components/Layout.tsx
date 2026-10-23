import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="ProFind, início">
      Pro<span>Find</span>
      <i />
    </Link>
  )
}
export function Support() {
  const phone = import.meta.env.VITE_SUPPORT_WHATSAPP
  return phone && /^\d{10,15}$/.test(phone) ? (
    <a
      className="button secondary"
      href={`https://wa.me/${phone}?text=${encodeURIComponent('Olá! Preciso de ajuda com o ProFind.')}`}
      target="_blank"
      rel="noreferrer"
    >
      Falar pelo WhatsApp <ArrowUpRight size={17} />
    </a>
  ) : (
    <p className="muted">O canal oficial de suporte será informado em breve.</p>
  )
}
export function Layout() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="header">
        <div className="container header-inner">
          <Brand />
          <button
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="main-nav"
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="main-nav"
            className={open ? 'navigation open' : 'navigation'}
            aria-label="Navegação principal"
            onClick={() => setOpen(false)}
          >
            <a href="/#categorias">Serviços</a>
            <a href="/#como-funciona">Como funciona</a>
            <a href="/#profissionais">Para profissionais</a>
            <Link className="nav-login" to={user ? '/conta' : '/entrar'}>
              {user ? 'Minha conta' : 'Entrar'}
            </Link>
            <Link className="button small" to="/cadastrar?perfil=professional">
              Sou profissional <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      </header>
      <main id="conteudo">
        <Outlet />
      </main>
      <footer>
        <div className="container footer-inner">
          <div>
            <Brand />
            <p>Conectando necessidades a quem sabe fazer.</p>
          </div>
          <div>
            <a href="/#suporte">Contato e suporte</a>
            <p>ProFind · Projeto em desenvolvimento</p>
          </div>
          <p>
            Vale do Paraíba, SP
            <br />© {new Date().getFullYear()} ProFind
          </p>
        </div>
      </footer>
    </>
  )
}
