# Decisões de arquitetura · Sprint 1

## Escopo e precedência

O PRD 3.1 foi lido integralmente. O texto de inicialização define o recorte da execução. A ordem de congelamento do PRD foi subordinada à instrução expressa de não criar a tag antes da aprovação da responsável. Propostas de regras comerciais e itens de sprints futuras não foram transformados em funcionalidades desta entrega.

## Aplicação

SPA React/TypeScript/Vite, SDK modular Firebase, React Router e Tailwind via plugin Vite. Firebase Hosting serve `dist` e faz fallback de URLs para `index.html`. Não há servidor próprio nem infraestrutura alternativa. A configuração pública Firebase vem de variáveis `VITE_*`; senhas, contas de serviço e privilégios não são incluídos no frontend.

O Vite usa `--configLoader runner` para carregar corretamente as dependências nativas Tailwind no ambiente Windows. O lockfile registra as versões exatas. O bundle inicial inclui os SDKs Auth/Firestore; o aviso de tamanho do Vite é conhecido e não é erro de compilação.

## Identidade e autorização

Uma identidade Firebase Auth por e-mail. `users/{uid}` contém `name`, `email`, `roles`, `createdAt` e `updatedAt`. Os únicos papéis autodeclarados são `client` e `professional`. Uma conta pode adicionar o segundo papel, sem criar outro usuário. Remoção de papéis, exclusão, alteração de e-mail e campos adicionais não fazem parte desta etapa.

`professionalProfiles/{uid}` nasce junto com o papel profissional em uma transação: `status: DRAFT`, `available: false`, `createdAt`, `updatedAt`. As regras usam `getAfter`/`existsAfter` para exigir consistência entre os dois documentos. O SDK pode repetir a operação de forma idempotente. Aprovação, disponibilidade, categorias, região e perfil completo serão tratados na Sprint 2.

Admin é exclusivamente uma custom claim `admin: true` no token Auth. Nenhum campo Firestore concede esse acesso. O script `scripts/set-admin.mjs` exige credenciais de operador confiável via Application Default Credentials e preserva outras claims. O administrador tem somente uma tela de destino nesta sprint; não possui acesso genérico aos dados dos usuários pelas regras.

O contexto acompanha `onIdTokenChanged` e o próprio perfil via `onSnapshot`, com tratamento de carregamento, erro, ausência de documento, logout e resultados assíncronos obsoletos. Persistência local é gerenciada pelo SDK, sem implementação manual de armazenamento de tokens. Se Auth criar uma conta e o Firestore falhar, `/conta` permite concluir o cadastro depois de autenticar, sem pedir nova conta.

## Segurança

- Negar todas as coleções não implementadas; nenhum pedido ou oferta pode ser gravado.
- Leitura pontual apenas do próprio documento. Listagens e documentos de outros usuários são bloqueados, inclusive para admin nesta etapa.
- Validar esquema fechado, e-mail do token, papéis permitidos e sem duplicações, timestamps do servidor e imutabilidade de criação.
- Perfil profissional é criado bloqueado; o navegador não pode aprovar, disponibilizar, atualizar ou apagar esse documento.
- Rotas aplicam autenticação e papel; os dados continuam protegidos pelas regras mesmo se alguém modificar o frontend.
- Hosting inclui CSP, proteção contra enquadramento, MIME sniffing e política restritiva de câmera/microfone/localização.
- `.env.local`, credenciais, ferramentas locais e relatórios brutos são ignorados pelo Git.

Claims removidas podem permanecer válidas no token já emitido até sua expiração, normalmente até uma hora. O script revoga refresh tokens e orienta novo login. Revogação imediata com verificação de sessão no servidor não faz parte desta tela administrativa mínima.

## Identidade visual e conteúdo

Verde `#2F4F4F`, dourado `#DAA520`, fundos neutros, ilustração feita em CSS e ícones Lucide. A marca é uma apresentação tipográfica provisória, não um novo logotipo definitivo. Não foram adicionados números comerciais, depoimentos, avaliações nem promessas de aprovação profissional. O telefone de suporte não foi inventado; a variável opcional só gera link WhatsApp quando contém um número válido.

## Dependências

Overrides de `@grpc/grpc-js`, `@opentelemetry/core` e `gaxios > uuid` corrigem alertas das versões transitivas selecionadas pelo SDK/CLI. Foram verificados com build, regras e fluxos integrados. Restam três entradas de auditoria de alta severidade na cadeia de desenvolvimento `firebase-tools → chokidar → braces`, sem correção compatível apresentada pelo registro nesta execução. Não foi aplicado downgrade forçado do Firebase CLI. Essas bibliotecas não integram o bundle servido ao navegador. `npm audit --omit=dev` retorna zero vulnerabilidades.

## Referências consultadas

- [Vite](https://vite.dev/guide/)
- [Tailwind com Vite](https://tailwindcss.com/docs/installation/using-vite)
- [React Router declarativo](https://reactrouter.com/start/declarative/installation)
- [Firebase Auth e Security Rules](https://firebase.google.com/docs/rules/rules-and-auth)
- [Custom claims](https://firebase.google.com/docs/auth/admin/custom-claims)
