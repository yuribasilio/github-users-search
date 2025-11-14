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
- **Radix UI** - Componentes acessíveis e sem estilo
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

# Copia o arquivo de exemplo de variáveis de ambiente
cp .env.example .env.local

# Edite o arquivo .env.local se necessário (valores padrão já estão configurados)
```

### Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configuração. Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# GitHub API Configuration
NEXT_PUBLIC_GITHUB_API_BASE_URL=https://api.github.com
NEXT_PUBLIC_GITHUB_RESULTS_PER_PAGE=20
```

**Variáveis disponíveis:**
- `NEXT_PUBLIC_GITHUB_API_BASE_URL`: URL base da API do GitHub (padrão: `https://api.github.com`)
- `NEXT_PUBLIC_GITHUB_RESULTS_PER_PAGE`: Número de resultados por página (padrão: `20`)

> **Nota:** O arquivo `.env.local` não é versionado no Git. Use `.env.example` como referência.

## 📚 Estrutura do Projeto

```
src/
├── app/              # Rotas e entrypoints do Next.js App Router
│   ├── layout.tsx    # Layout principal da aplicação
│   └── page.tsx      # Página principal com busca de usuários
├── components/       # Componentes da aplicação
│   ├── SearchBar/   # Componente de busca
│   ├── UserCard/     # Card de exibição de usuário
│   ├── UserModal/    # Modal com detalhes do usuário
│   └── Pagination/   # Componente de paginação
├── hooks/           # Custom React hooks
│   └── useGitHubSearch.ts  # Hook para gerenciar busca e paginação
├── services/        # Integração com APIs
│   └── github.ts    # Serviço de integração com GitHub API
├── types/           # Tipos TypeScript compartilhados
│   └── github.ts    # Tipos para dados do GitHub
├── constants/       # Constantes centralizadas
│   └── ui-texts.ts  # Textos da UI e mensagens centralizadas
└── tests/           # Utilitários e mocks globais para testes
    └── setup-tests.ts  # Configuração de testes
```

## 🎯 Funcionalidades

- **Busca de Usuários**: Busca usuários do GitHub através da API oficial
- **Paginação**: Exibe 20 resultados por página com navegação intuitiva
- **Modal de Detalhes**: Ao clicar no nome do usuário, abre um modal com informações detalhadas
- **Link para Perfil**: Botão no modal para acessar o perfil completo no GitHub
- **Design Responsivo**: Interface adaptável para diferentes tamanhos de tela
- **Acessibilidade**: Componentes seguindo diretrizes WCAG 2.1
- **Tratamento de Erros**: Mensagens de erro claras e tratamento de rate limits

## 📦 Componentes Overview

### SearchBar

Componente de busca que permite ao usuário inserir uma query e buscar usuários do GitHub.

**Localização**: `src/components/SearchBar/`

**Props**:
- `onSearch: (query: string) => void` - Callback chamado quando a busca é submetida
- `isLoading?: boolean` - Indica se a busca está em andamento
- `placeholder?: string` - Texto placeholder do input

**Características**:
- Acessível via teclado
- Validação de entrada vazia
- Estado de loading visual

### UserCard

Componente que exibe informações básicas de um usuário do GitHub em formato de card.

**Localização**: `src/components/UserCard/`

**Props**:
- `user: GitHubUser` - Dados do usuário a serem exibidos
- `onClick: (user: GitHubUser) => void` - Callback chamado quando o card é clicado

**Características**:
- Exibe avatar, username, nome e bio
- Clicável para abrir modal de detalhes
- Acessível via teclado (Enter e Space)
- Design responsivo

### UserModal

Modal que exibe informações detalhadas do usuário usando Radix UI Dialog.

**Localização**: `src/components/UserModal/`

**Props**:
- `user: GitHubUser | null` - Dados do usuário a serem exibidos
- `open: boolean` - Controla se o modal está aberto
- `onOpenChange: (open: boolean) => void` - Callback para controlar abertura/fechamento

**Características**:
- Usa Radix UI Dialog para acessibilidade completa
- Exibe informações completas do usuário (localização, empresa, seguidores, etc.)
- Link direto para o perfil no GitHub
- Fechamento via ESC ou botão de fechar
- Animações suaves de entrada/saída

### Pagination

Componente de paginação para navegar entre páginas de resultados.

**Localização**: `src/components/Pagination/`

**Props**:
- `currentPage: number` - Página atual (1-indexed)
- `totalPages: number` - Total de páginas
- `onPageChange: (page: number) => void` - Callback quando a página muda
- `disabled?: boolean` - Desabilita a paginação (ex: durante loading)

**Características**:
- Exibe até 7 números de página com ellipsis quando necessário
- Botões Previous/Next
- Não renderiza quando há apenas 1 página
- Acessível via teclado
- Estado visual da página atual

## 🔌 Serviços

### GitHub Service

Serviço que gerencia todas as interações com a API do GitHub.

**Localização**: `src/services/github.ts`

**Funções**:
- `searchUsers(query: string, page: number)` - Busca usuários com paginação (20 por página)
- `getUserDetails(username: string)` - Busca detalhes completos de um usuário
- `calculateTotalPages(totalCount: number)` - Calcula total de páginas

**Características**:
- Tratamento de erros (rate limits, 404, etc.)
- TypeScript tipado
- JSDoc completo

## 📝 Constantes

### UI Texts (ui-texts.ts)

Arquivo centralizado contendo todos os textos da interface do usuário e mensagens da aplicação.

**Localização**: `src/constants/ui-texts.ts`

**Estrutura**:
- `searchBar` - Textos do componente SearchBar (placeholders, labels, aria-labels)
- `userModal` - Textos do componente UserModal (labels de campos, botões)
- `pagination` - Textos do componente Pagination (navegação, aria-labels)
- `homePage` - Textos da página principal (títulos, estados vazios, mensagens)
- `userCard` - Textos do componente UserCard (aria-labels, alt texts)
- `metadata` - Metadados da aplicação (title, description para SEO)
- `errors` - Mensagens de erro padronizadas

**Características**:
- **Manutenibilidade**: Todos os textos em um único local facilitam atualizações
- **Consistência**: Garante uso uniforme de textos em toda a aplicação
- **Internacionalização**: Facilita futuras traduções (i18n)
- **Acessibilidade**: Centraliza textos de aria-label e descrições
- **Type-safety**: TypeScript garante que textos existam e sejam tipados
- **Funções dinâmicas**: Suporte a textos com parâmetros (ex.: `foundUsers(count)`)
- **Pluralização**: Lógica de pluralização integrada

**Uso**:
Todos os componentes importam `UI_TEXTS` e utilizam os textos apropriados, evitando strings hardcoded e garantindo consistência em toda a aplicação.

## 🧪 Testes

Todos os componentes possuem testes colocalizados seguindo o padrão TDD. Os testes cobrem:

- Renderização inicial
- Interações do usuário
- Estados de loading e erro
- Acessibilidade
- Casos extremos (valores nulos, arrays vazios, etc.)

**Executar testes**:
```bash
yarn test        # Executa todos os testes
yarn test:ui     # Interface gráfica do Vitest
```

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico para a CAIENA.
