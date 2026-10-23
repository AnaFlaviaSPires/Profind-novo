import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  PaintRoller,
  Zap,
  BrickWall,
  Droplets,
  Sparkles,
  ChefHat,
  Sprout,
  Check,
  MapPin,
  ShieldCheck,
  CalendarDays,
  Send,
  Handshake,
} from 'lucide-react'
import { Support } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { firebaseConfigured } from '../lib/firebase'

const categories = [
  { name: 'Pintor', detail: 'Novas cores para seus espaços', icon: PaintRoller },
  { name: 'Eletricista', detail: 'Cuidado com as instalações', icon: Zap },
  { name: 'Pedreiro', detail: 'Reparos e melhorias', icon: BrickWall },
  { name: 'Encanador', detail: 'Soluções para a parte hidráulica', icon: Droplets },
  { name: 'Diarista', detail: 'Mais cuidado com a sua casa', icon: Sparkles },
  { name: 'Cozinheiro', detail: 'Sabor na sua rotina', icon: ChefHat },
  { name: 'Jardineiro', detail: 'Vida para a sua área verde', icon: Sprout },
]
export function Home() {
  const { user } = useAuth()
  const request = user ? '/cliente' : '/entrar?destino=cliente'
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> CONEXÕES QUE FACILITAM O DIA
            </div>
            <h1>
              Quem sabe fazer.
              <br />
              <span>
                Quando você
                <br className="desktop-break" /> precisar.
              </span>
            </h1>
            <p className="hero-description">
              Sua casa precisa de cuidado. Sua rotina, de praticidade. Conheça o ProFind: uma nova
              forma de conectar você a profissionais de serviços.
            </p>
            <div className="actions">
              <Link className="button" to={request}>
                Solicitar serviço <ArrowUpRight size={19} />
              </Link>
              <a className="text-link" href="#como-funciona">
                Veja como funciona <ArrowRight size={17} />
              </a>
            </div>
            <p className="hero-note">
              <MapPin size={15} /> Pensado para o Vale do Paraíba, SP
            </p>
          </div>
          <div
            className="hero-art"
            role="img"
            aria-label="Ilustração de uma casa com ferramentas, representando os serviços do ProFind"
          >
            <div className="art-grid" />
            <div className="art-label">UM NOVO JEITO DE CUIDAR</div>
            <div className="house">
              <div className="roof" />
              <div className="house-front">
                <div className="window">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="door" />
                <div className="house-line" />
              </div>
              <div className="plant">
                <Sprout size={77} strokeWidth={1.3} />
                <span />
              </div>
            </div>
            <div className="floating-tool tool-paint">
              <PaintRoller size={36} strokeWidth={1.5} />
            </div>
            <div className="floating-tool tool-zap">
              <Zap size={30} strokeWidth={1.5} />
            </div>
            <div className="art-card">
              <div className="art-card-icon">
                <Handshake size={25} />
              </div>
              <div>
                <strong>Uma conexão. Muitas soluções.</strong>
                <span>Da sua necessidade ao profissional.</span>
              </div>
              <Check size={19} />
            </div>
            <span className="art-bottom">SUA CASA EM BOAS CONEXÕES</span>
            <span className="art-plus">+</span>
          </div>
        </div>
      </section>
      <section className="categories section" id="categorias">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PARA CADA NECESSIDADE</p>
              <h2>O cuidado que seu espaço pede.</h2>
            </div>
            <p>
              Sete categorias para facilitar
              <br />o seu dia a dia.
            </p>
          </div>
          <div className="category-grid">
            {categories.map(({ name, detail, icon: Icon }) => (
              <Link to={request} className="category" key={name}>
                <span className="category-icon">
                  <Icon size={29} strokeWidth={1.5} />
                </span>
                <h3>{name}</h3>
                <p>{detail}</p>
                <ArrowUpRight className="category-arrow" size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="how section" id="como-funciona">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MENOS COMPLICAÇÃO, MAIS CONEXÃO</p>
              <h2>
                Você conta o que precisa.
                <br />O ProFind faz a ponte.
              </h2>
            </div>
            <p>
              Conheça o fluxo que estamos construindo
              <br />
              para os próximos passos da plataforma.
            </p>
          </div>
          <div className="steps">
            {[
              {
                icon: Send,
                title: 'Conte sua necessidade',
                text: 'Você informará o serviço, o local e o melhor período para o atendimento.',
              },
              {
                icon: CalendarDays,
                title: 'Encontre compatibilidade',
                text: 'A solicitação será oferecida aos profissionais elegíveis para o seu pedido.',
              },
              {
                icon: Handshake,
                title: 'Acompanhe a conexão',
                text: 'O primeiro aceite válido confirmará o profissional responsável pelo serviço.',
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <article className="step" key={title}>
                <div className="step-top">
                  <Icon size={27} strokeWidth={1.5} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="release-note">
            {firebaseConfigured
              ? 'Neste primeiro lançamento, você já pode criar sua conta.'
              : 'A abertura de contas aguarda a ativação da plataforma.'}{' '}
            Solicitações e atendimentos serão disponibilizados nas próximas etapas.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container benefits-grid">
          <div>
            <p className="eyebrow">MAIS TEMPO PARA O QUE IMPORTA</p>
            <h2>
              Praticidade começa
              <br />
              com uma boa conexão.
            </h2>
            <p className="body-copy">
              Um só lugar para iniciar sua jornada de contratação, com uma experiência clara desde o
              cadastro.
            </p>
            <ul className="check-list">
              <li>
                <Check /> Cadastro simples, sem documentos nesta etapa
              </li>
              <li>
                <Check /> Acesso à sua conta com segurança
              </li>
              <li>
                <Check /> Uma plataforma pensada para o celular
              </li>
            </ul>
            <Link className="text-link" to="/cadastrar">
              Quero criar minha conta <ArrowRight size={18} />
            </Link>
          </div>
          <div className="professional-panel" id="profissionais">
            <span className="panel-icon">
              <ShieldCheck size={29} strokeWidth={1.5} />
            </span>
            <p className="eyebrow">SEU TALENTO TEM ESPAÇO AQUI</p>
            <h2>
              Você faz bem.
              <br />A gente conecta.
            </h2>
            <p>
              Faça seu cadastro como profissional e prepare-se para as próximas etapas do ProFind.
            </p>
            <p>
              <strong>Sem mensalidade ou assinatura.</strong> O modelo será por comissão sobre
              serviços realizados, com condições ainda a definir.
            </p>
            <Link className="button gold" to="/cadastrar?perfil=professional">
              Sou profissional <ArrowUpRight size={18} />
            </Link>
            <small>
              Perfil completo e aprovação nas próximas etapas. O cadastro inicial não habilita o
              recebimento de solicitações.
            </small>
          </div>
        </div>
      </section>
      <section className="support section" id="suporte">
        <div className="container support-inner">
          <div>
            <p className="eyebrow">VAMOS CONVERSAR</p>
            <h2>Precisa de uma mão para começar?</h2>
            <p>Um canal de apoio para dúvidas sobre cadastro e uso da plataforma.</p>
          </div>
          <Support />
        </div>
      </section>
    </>
  )
}
