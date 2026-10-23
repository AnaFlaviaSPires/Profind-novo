# Demonstração reproduzível · Sprint 1

Use somente contas fictícias nos emuladores ou um projeto de demonstração isolado. A versão atual ainda não está congelada nem aprovada.

1. Instale pelo lockfile (`npm ci`) e configure Java 21.
2. Rode `npm run emulators` em um terminal e `npm run dev:emulator` em outro. Acesse o endereço local exibido pelo Vite.
3. Mostre a home, as sete categorias e o menu no celular.
4. Clique “Solicitar serviço”. Crie uma conta cliente fictícia com nome, e-mail, senha e confirmação. Mostre o destino mínimo e a explicação de funcionalidades futuras.
5. Atualize a página para conferir a sessão. Saia e entre novamente. Tente `/admin`: o acesso deve ser restrito.
6. Adicione o papel profissional na mesma conta. Entre no ambiente profissional e mostre a mensagem de cadastro inicial, sem recebimento de solicitações. Alterne entre os dois ambientes.
7. Saia. Cadastre outra conta diretamente por “Sou profissional”. Ela deve abrir o ambiente profissional e continuar bloqueada para solicitações.
8. Saia e use “Esqueci minha senha”. No emulador, o link de recuperação aparece no terminal; nenhum e-mail real é enviado. A suíte integrada comprova geração e consumo do código e login com a nova senha.
9. Execute `npm run test:rules` após encerrar os emuladores manuais e apresente o isolamento de dados e os bloqueios de autoaprovação e admin.
10. Mostre a URL Firebase real **somente após publicação e verificação**. Teste cadastro, login, logout e recuperação em navegador/celular independentes. No projeto real, confirme a chegada do e-mail de recuperação.

Evidências de layout estão em `docs/evidencias/`. Playwright também produz capturas locais em `artifacts/` e relatórios em `playwright-report/` e `test-results/`, ignorados pelo Git por poderem conter dados de sessões.

Após aprovação explícita da Sprint 1: registre o commit aprovado, resultados dos testes, URL verificada, configuração e regras; crie a tag `sprint-1-v0.1.0` nesse commit. A tag não deve ser movida. Para reapresentação futura, faça checkout dela em outra pasta e use o emulador ou um projeto Firebase de demonstração exclusivo, nunca uma base de produção incompatível com as regras antigas. Preserve o lockfile e não copie segredos para snapshots.
