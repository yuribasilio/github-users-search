# Explicação da aplicação

## Visão geral

Aplicação Next.js (App Router) para buscar e visualizar usuários do GitHub, integrando com a API do GitHub.

## Arquitetura e decisões

### 1. Estrutura de pastas (padrão obrigatório)

```
src/
├── app/              # Next.js App Router
├── components/       # Componentes com estrutura ComponentName/
├── hooks/            # Custom hooks
├── services/         # Integração com APIs
├── types/            # Tipos TypeScript
├── constants/        # Constantes centralizadas
└── tests/            # Utilitários de teste
```

**Por quê:**
- Separação de responsabilidades
- Componentes em pastas próprias (ex.: SearchBar/SearchBar.tsx)
- Testes colocalizados (.spec.tsx)
- Facilita manutenção e escalabilidade

### 2. Componentes

#### SearchBar (src/components/SearchBar/)

**Características:**
- Acessibilidade: role="search", aria-label, aria-busy
- Validação: impede busca vazia
- Estado de loading visual
- Suporte a dark mode

#### UserCard (src/components/UserCard/)

**Características:**
- Navegação por teclado (Enter/Space)
- Next.js Image para otimização
- Truncamento de texto
- Design responsivo

#### UserModal (src/components/UserModal/)

**Características:**
- Radix UI Dialog para acessibilidade
- Skeleton loading durante carregamento
- Formatação de datas e números
- Fechamento via ESC
- Link para perfil no GitHub

#### Pagination (src/components/Pagination/)

**Características:**
- Exibe até 7 páginas com ellipsis
- Lógica adaptativa conforme a página atual
- Não renderiza quando há apenas 1 página
- Acessível com aria-label e aria-current

### 3. Custom Hook: useGitHubSearch

**Por quê:**
- Separa lógica de estado da UI
- Reutilizável
- useCallback para evitar re-renders desnecessários
- Centraliza gerenciamento de busca e paginação

### 4. Service Layer: github.ts

**Características:**
- Tratamento de erros (rate limit, 404, etc.)
- TypeScript tipado
- JSDoc
- Variáveis de ambiente para configuração
- Retorno padronizado { data, error }

### 5. Constantes Centralizadas: ui-texts.ts

**Localização:** `src/constants/ui-texts.ts`

**Por quê:**
- **Manutenibilidade**: Todos os textos da UI em um único local
- **Consistência**: Garante uso uniforme de textos em toda a aplicação
- **Internacionalização (i18n)**: Facilita futuras traduções
- **Acessibilidade**: Centraliza textos de aria-label e descrições
- **Type-safety**: TypeScript garante que textos existam e sejam tipados

**Estrutura:**
```typescript
UI_TEXTS = {
  searchBar: { ... },      // Textos do componente SearchBar
  userModal: { ... },      // Textos do componente UserModal
  pagination: { ... },     // Textos do componente Pagination
  homePage: { ... },       // Textos da página principal
  userCard: { ... },       // Textos do componente UserCard
  metadata: { ... },       // Metadados (title, description)
  errors: { ... }          // Mensagens de erro padronizadas
}
```

**Características:**
- Organização por componente/contexto
- Funções para textos dinâmicos (ex.: `foundUsers(count)`)
- Suporte a pluralização
- Mensagens de erro centralizadas
- Metadados da aplicação (SEO)

**Uso:**
Todos os componentes importam `UI_TEXTS` e utilizam os textos apropriados, evitando strings hardcoded e garantindo consistência.

### 6. Página principal (src/app/page.tsx)

**Características:**
- Orquestra componentes e hooks
- Estados de loading, erro e vazio
- Busca de detalhes do usuário ao abrir o modal
- Design responsivo com grid adaptativo

## Decisões técnicas

### 1. Next.js App Router
- Roteamento moderno
- Server Components quando necessário
- Otimizações automáticas

### 2. TypeScript
- Tipagem forte
- Tipos compartilhados em src/types/
- Menos erros em runtime

### 3. Tailwind CSS
- Estilização utilitária
- Dark mode nativo
- Responsividade mobile-first

### 4. Radix UI
- Acessibilidade (ARIA, foco, teclado)
- Sem estilos pré-definidos
- Componentes primitivos

### 5. Vitest + React Testing Library
- Testes rápidos
- Testes colocalizados
- Cobertura de componentes

### 6. Estrutura de componentes
- Um componente por pasta
- Testes colocalizados
- Export via index.tsx
- Facilita manutenção e escalabilidade

## Funcionalidades implementadas

- Busca de usuários via API do GitHub
- Paginação (20 resultados por página)
- Modal com detalhes do usuário
- Link para perfil no GitHub
- Design responsivo
- Acessibilidade (WCAG 2.1)
- Tratamento de erros (rate limits, 404, etc.)
- Dark mode
- Loading states
- Testes automatizados

## Conclusão

A aplicação segue as regras do desafio:
- Estrutura de componentes obrigatória
- TDD com testes colocalizados
- TypeScript com tipagem forte
- Acessibilidade (WCAG 2.1)
- Documentação em inglês (JSDoc)
- README atualizado
- Separação de responsabilidades
- Código limpo e manutenível

A arquitetura prioriza manutenibilidade, escalabilidade e experiência do usuário, com foco em acessibilidade e boas práticas de desenvolvimento.

