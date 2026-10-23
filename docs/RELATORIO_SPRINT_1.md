# Relatório da primeira execução · Sprint 1 · v0.1.0

Data: **23/10/2026**, America/Sao_Paulo. Estado: **implementação local validada; Sprint 1 ainda não concluída pelos critérios de aceite online**. O projeto Firebase ainda não foi criado, conforme resposta da responsável. Nenhum recurso de Sprint 2 ou posterior foi implementado.

## 1. Implementações

Home comercial responsiva, identidade nas cores definidas, sete categorias exatas, apresentação, como funciona, vantagens, CTAs distintos, área de contato e rodapé. Marca tipográfica provisória; ilustração feita em CSS. Nenhuma estatística, avaliação ou depoimento comercial inventado.

Cadastro de cliente/profissional por e-mail/senha e confirmação, validação, erros, login, logout, recuperação de acesso e persistência pelo Firebase SDK. Uma identidade admite ambos os papéis. O acesso administrativo usa custom claim confiável. Rotas privadas e destinos mínimos dos três ambientes estão preparados. Contas com perfil incompleto por falha de gravação podem concluir o cadastro ao entrar novamente.

O profissional nasce com status `DRAFT` e `available: false`, sem possibilidade de autoaprovação. Funcionalidades operacionais futuras são identificadas como indisponíveis. Sem configuração Firebase, o produto informa a pendência e não simula autenticação.

## 2. Arquitetura e arquivos

SPA modular em `src/components`, `pages`, `routes`, `contexts`, `lib`, `services` e `types`, com Tailwind e CSS em `src/index.css`. Testes separados em `tests/unit`, `rules`, `browser` e `integration`. Regras e índices Firestore são versionados na raiz. `firebase.json` define Hosting SPA, cabeçalhos e emuladores. Scripts de deploy, verificação de URL e administração ficam em `scripts`. Workflows estão em `.github/workflows`.

Detalhamento em [ARQUITETURA.md](ARQUITETURA.md) e estrutura completa em [README.md](../README.md).

## 3. Tecnologias e versões utilizadas

Versões efetivamente instaladas, disponíveis pelo registro durante esta execução e preservadas no `package-lock.json`:

| Tecnologia | Versão |
| --- | --- |
| Node.js / npm | 24.15.0 / 11.12.1 |
| React / React DOM | 19.3.1 |
| TypeScript | 6.0.3 |
| Vite / plugin React | 8.3.5 / 6.1.2 |
| Tailwind CSS / plugin Vite | 4.3.3 |
| React Router DOM | 7.18.4 |
| Firebase Web SDK | 13.1.0 |
| Firebase CLI | 15.34.1 |
| Firebase Admin SDK, apenas ferramenta confiável/testes | 14.5.0 |
| Rules Unit Testing | 6.0.0 |
| Vitest | 5.0.5 |
| Playwright | 1.64.1 |
| Java usado no emulador | Eclipse Temurin 21.0.12.1 |
| Firestore Emulator | 1.22.0 |
| Lucide React | 1.61.0 |
| Prettier | 3.9.10 |

## 4. Integrações

| Integração | Estado real |
| --- | --- |
| Firebase Authentication | SDK integrado e fluxos testados no emulador; provedor real ainda não configurado |
| Cloud Firestore | Persistência transacional e leitura privada testadas no emulador; banco real ainda não criado |
| Firebase Hosting | Configuração e scripts prontos; deploy não realizado |
| Git | Novo repositório local independente, branch `main`, commits registrados |
| GitHub | CI e deploy manual preparados; repositório remoto, push e workflows ainda não configurados/executados |
| WhatsApp | Componente preparado; sem telefone oficial fornecido, sem link fictício |

## 5. Regras de segurança

Negação por padrão. Cada usuário pode obter somente os próprios documentos; listagens e acesso a outro UID são proibidos. Esquema fechado impede campos administrativos, papéis arbitrários e dados adicionais. E-mail deve coincidir com o token. Criação e atualização usam timestamps de servidor; criação/e-mail são preservados.

Perfil profissional só pode ser criado bloqueado e junto do papel correspondente. Não pode ser atualizado pelo navegador nesta etapa. Admin não é um papel editável no Firestore: a tela verifica `admin: true` no token Auth, concedido somente por operador confiável. Nenhuma coleção operacional foi aberta. O teste com claim admin também comprova que ela não permite listar documentos privados nesta sprint.

## 6. Testes executados e resultados

**27 testes aprovados**, sem falhas nas suítes concluídas:

| Verificação | Resultado |
| --- | --- |
| `npm test` | 6/6: dados válidos, nome, e-mail, senha, confirmação e login de conta preexistente |
| `npm run test:rules` | 8/8 no Firestore Emulator: isolamento, esquema, admin, aprovação, transação e imutabilidade |
| `npm run test:e2e` | 6/6 no Edge: home/formulários em 320, 390, 768 e 1440 px, menu e rotas privadas |
| `npm run test:integration` | 7/7 no Edge com Auth/Firestore Emulator: cadastro, sessão, login/logout, papéis, erro, recuperação, interrupção e admin autorizado |
| `npm run build` | Aprovado: TypeScript e Vite sem erros |
| `npm run deploy` sem configuração | Bloqueio esperado antes de qualquer publicação; nenhum projeto fictício publicado |
| `npm audit --omit=dev` | Zero vulnerabilidades conhecidas nas dependências de produção |
| `npm audit` completo | 3 alertas de alta severidade na cadeia de ferramentas `firebase-tools → chokidar → braces` |

A recuperação foi comprovada pela geração e consumo do código no emulador, seguida de login com a senha alterada. **Não foi comprovado envio de e-mail real.** As larguras foram emuladas em navegador desktop; não se declara teste em aparelho físico. As capturas foram inspecionadas e não houve rolagem horizontal nos testes.

O build informa aviso de bundle inicial acima de 500 kB: aproximadamente 837 kB de JavaScript, 256 kB gzip, incluindo Auth e Firestore. É um ponto de otimização registrado, sem impedir o build. Os três alertas da ferramenta de desenvolvimento não têm correção compatível apresentada pelo registro nesta execução; não foi feito downgrade forçado do CLI.

Evidências visuais: [320 px](evidencias/home-320.png), [390 px](evidencias/home-390.png), [768 px](evidencias/home-768.png), [1440 px](evidencias/home-1440.png). Fontes dos testes estão versionadas. Relatórios brutos locais ficam ignorados por poderem conter dados de sessão.

## 7. Situação da publicação

**Não publicada.** A responsável informou “NÃO CRIEI” ao ser consultada sobre o projeto Firebase. Também não havia sessão do Firebase CLI disponível. Foram concluídas as implementações que independem dessas ações, sem ativar planos pagos.

## 8. URL Firebase Hosting

**Indisponível: não existe URL publicada e verificada nesta entrega.** O formato esperado e o comando de verificação estão em [PUBLICACAO.md](PUBLICACAO.md). Nenhum endereço foi apresentado como existente.

## 9. Commit e congelamento

Commit da implementação, configuração, testes e evidências: **`5aaa408c034890a2b85e580da73ae7ec3bc3862e`** (`feat: implement ProFind sprint 1 foundation and Firebase integration`). Este relatório é acrescentado em commit documental posterior, verificável por `git log --oneline`.

**Nenhuma tag foi criada.** A tag prevista `sprint-1-v0.1.0` depende do aceite online e da confirmação explícita da responsável. Roteiro e preservação estão em [DEMONSTRACAO.md](DEMONSTRACAO.md).

## 10. Pendências técnicas

- Criar e conectar projeto Firebase Spark exclusivo, aplicativo Web, Auth e banco Firestore real.
- Publicar regras, índices e Hosting; verificar endereço, fallback de rotas e todos os fluxos no ambiente real.
- Confirmar entrega/consumo do e-mail de recuperação real e política de senha no Firebase.
- Criar novo repositório GitHub, enviar commits e validar o CI remoto.
- Configurar OIDC/WIF e IAM para deploy automatizado, se desejado; workflow está preparado e não foi executado remotamente.
- Receber telefone oficial de suporte e logomarca existente.
- Acompanhar correção da dependência transitiva do Firebase CLI e otimização do bundle inicial.
- Revisar textos de privacidade/termos antes da operação comercial, sem inventar políticas aprovadas.

## 11. Ações necessárias da responsável

Seguir [PUBLICACAO.md](PUBLICACAO.md): criar o novo projeto gratuito no console, habilitar E-mail/senha, criar Firestore em produção e registrar o app Web. Disponibilizar os quatro valores públicos do `firebaseConfig` e participar do login do Firebase CLI. Não enviar senhas ou credenciais administrativas pelo chat.

Criar repositório GitHub novo na conta/organização correta e fornecer sua URL exata. Informar o WhatsApp oficial e disponibilizar a logomarca, quando houver. Após a publicação e verificação online, revisar a Sprint 1 e autorizar a tag se aprovada. Não há pedido de aprovação para avançar de sprint nesta entrega.

## 12. Avaliação objetiva dos critérios de aceite

| Critério solicitado | Avaliação |
| --- | --- |
| Página comercial acessível online | **Pendente:** Hosting não publicado |
| Layout em computador e celular | **Validado localmente:** 320/390/768/1440 px; aparelho físico e site online pendentes |
| Cliente cria conta | **Validado no emulador:** pendente no Firebase real |
| Profissional cria conta | **Validado no emulador:** pendente no Firebase real |
| Ambos entram e saem | **Validado no emulador:** pendente online |
| Recuperação funcional | **Validada no emulador**, incluindo nova senha; entrega real do e-mail pendente |
| Perfis registrados no Firestore | **Validado no emulador:** banco real pendente |
| Rotas respeitam autenticação/autorização | **Validado localmente:** visitante, papéis e admin por claim |
| Usuário comum não acessa outro usuário | **Validado pelas regras no emulador**, inclusive leitura direta e listagem |
| Usuário não se atribui admin | **Validado pelas regras e navegação** |
| Build sem erros | **Aprovado**, com aviso de tamanho documentado |
| Testes aplicáveis executados | **Aprovado localmente:** 27/27 |
| Deploy Hosting verificado | **Pendente:** nenhum deploy ocorreu |
| Contato e suporte | **Parcial:** seção pronta, número oficial pendente |
| Novo GitHub e deploy reproduzível | **Parcial:** Git e scripts prontos; remoto e configuração externa pendentes |

**Aceite global: pendente.** A fundação está implementada e testada localmente. Não se declara a Sprint 1 concluída nem congelada enquanto faltarem publicação, verificações reais e aprovação da responsável.
