# GitHub Users Search

Este é um desafio técnico desenvolvido em **Next.js** para a **CAIENA**. A aplicação permite buscar e visualizar informações de usuários do GitHub de forma eficiente e intuitiva.

## 📋 Sobre o Projeto

Aplicação web desenvolvida com Next.js (App Router), TypeScript e Tailwind CSS que integra com a API do GitHub para buscar e exibir informações de usuários. O projeto segue as melhores práticas de desenvolvimento, incluindo testes automatizados com Vitest e React Testing Library.

## 🚀 Principais Comandos

### Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento
yarn dev
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000).

### Build e Produção

```bash
# Cria uma build de produção
yarn build

# Inicia o servidor de produção (após o build)
yarn start
```

### Testes

```bash
# Executa os testes com cobertura
yarn test

# Executa os testes com interface gráfica
yarn test:ui
```

### Linting

```bash
# Verifica problemas de código
yarn lint

# Corrige automaticamente problemas de código
yarn lint:fix
```

## 🛠️ Tecnologias Utilizadas

- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilização
- **Vitest** - Framework de testes
- **React Testing Library** - Utilitários para testes de componentes
- **ESLint** - Linter para JavaScript/TypeScript

## 📦 Pré-requisitos

- Node.js >= 20.9.0
- Yarn (ou npm/pnpm)

## 🔧 Instalação

```bash
# Instala as dependências
yarn install
```

## 📚 Estrutura do Projeto

```
src/
├── app/              # Rotas e entrypoints do Next.js App Router
├── components/       # Componentes da aplicação
├── hooks/           # Custom React hooks
├── services/        # Integração com APIs
├── lib/             # Funções utilitárias
├── types/           # Tipos TypeScript compartilhados
└── tests/           # Utilitários e mocks globais para testes
```

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico para a CAIENA.
