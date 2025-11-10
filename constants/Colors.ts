// Church Helper - Identidade Visual
export const Colors = {
  // Cores Primárias da Marca (Paleta Oficial)
  primary: {
    teal: '#1CE5C0',        // Verde/Turquesa principal
    blue: '#5DBBF5',        // Azul médio
    navy: '#2B6B8F',        // Azul escuro/petróleo
    white: '#F5FCFF',       // Branco off-white
  },

  // Gradientes da Marca
  gradients: {
    primary: ['#1CE5C0', '#5DBBF5'],     // Teal para Azul
    secondary: ['#5DBBF5', '#2B6B8F'],    // Azul para Navy
    header: ['#2B6B8F', '#5DBBF5'],       // Navy para Azul (headers)
  },

  // Sistema de Cores Funcionais
  background: {
    primary: '#F5FCFF',       // Fundo principal
    secondary: '#FFFFFF',     // Cards e containers
    tertiary: '#E8FFFE',      // Fundo sutil com teal
    overlay: 'rgba(43, 107, 143, 0.9)', // Overlay modals
  },

  text: {
    primary: '#1E293B',       // Texto principal escuro
    secondary: '#64748B',     // Texto secundário
    tertiary: '#94A3B8',      // Texto sutil
    inverse: '#FFFFFF',       // Texto em fundos escuros
    brand: '#1E5A7D',         // Texto com cor da marca
  },

  accent: {
    teal: '#1CE5C0',         // Botões e ações principais
    blue: '#5DBBF5',         // Links e elementos interativos
    navy: '#2B6B8F',         // Headers e navegação
  },

  status: {
    success: '#10B981',       // Verde para sucessos
    warning: '#F59E0B',       // Amarelo para avisos
    error: '#EF4444',         // Vermelho para erros
    info: '#5DBBF5',          // Azul da marca para informações
    pending: '#F59E0B',       // Pendente
  },

  ui: {
    border: '#E2E8F0',        // Bordas sutis
    divider: '#F1F5F9',       // Divisores
    shadow: '#000000',        // Sombras
    disabled: '#CBD5E1',      // Elementos desabilitados
    placeholder: '#94A3B8',   // Texto placeholder
  },

  // Estados dos Componentes
  button: {
    primary: '#1CE5C0',
    primaryHover: '#15C9A8',
    secondary: '#5DBBF5',
    secondaryHover: '#3A9FE0',
    tertiary: '#2B6B8F',
    tertiaryHover: '#1F5470',
    disabled: '#CBD5E1',
  },

  card: {
    background: '#FFFFFF',
    border: '#F1F5F9',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  tab: {
    active: '#1CE5C0',
    inactive: '#64748B',
    background: '#FFFFFF',
    border: '#F1F5F9',
  }
};

// Função helper para acessar cores
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let result: any = Colors;
  
  for (const key of keys) {
    result = result[key];
    if (!result) return '#000000';
  }
  
  return result;
};

// Tema padrão
export const Theme = {
  colors: Colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },
  fontSize: {
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    title: 24,
    header: 28,
    display: 32,
  }
};