// Church Helper - Identidade Visual
export const Colors = {
  // Cores Primárias da Marca
  primary: {
    teal: '#00D4AA',        // Verde/Turquesa principal
    blue: '#4A90E2',        // Azul médio
    navy: '#2E5984',        // Azul escuro
    white: '#F5FCFF',       // Branco off-white
  },

  // Gradientes da Marca
  gradients: {
    primary: ['#00D4AA', '#4A90E2'],     // Teal para Azul
    secondary: ['#4A90E2', '#2E5984'],    // Azul para Navy
    header: ['#2E5984', '#4A90E2'],       // Navy para Azul (headers)
  },

  // Sistema de Cores Funcionais
  background: {
    primary: '#F5FCFF',       // Fundo principal
    secondary: '#FFFFFF',     // Cards e containers
    tertiary: '#F0F9FF',      // Fundo sutil
    overlay: 'rgba(46, 89, 132, 0.9)', // Overlay modals
  },

  text: {
    primary: '#1E293B',       // Texto principal escuro
    secondary: '#64748B',     // Texto secundário
    tertiary: '#94A3B8',      // Texto sutil
    inverse: '#FFFFFF',       // Texto em fundos escuros
    brand: '#2E5984',         // Texto com cor da marca
  },

  accent: {
    teal: '#00D4AA',         // Botões e ações principais
    blue: '#4A90E2',         // Links e elementos interativos
    navy: '#2E5984',         // Headers e navegação
  },

  status: {
    success: '#10B981',       // Verde para sucessos
    warning: '#F59E0B',       // Amarelo para avisos
    error: '#EF4444',         // Vermelho para erros
    info: '#4A90E2',          // Azul da marca para informações
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
    primary: '#00D4AA',
    primaryHover: '#00B894',
    secondary: '#4A90E2',
    secondaryHover: '#3A7BC8',
    tertiary: '#2E5984',
    tertiaryHover: '#1E3A6F',
    disabled: '#CBD5E1',
  },

  card: {
    background: '#FFFFFF',
    border: '#F1F5F9',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  tab: {
    active: '#2E5984',
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