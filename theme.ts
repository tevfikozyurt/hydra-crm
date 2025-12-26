export type BrandTheme = {
  colors: {
    critical: string;
    warning: string;
    normal: string;
    background: string;
    grid: string;
    textPrimary: string;
  };
};

export const defaultTheme: BrandTheme = {
  colors: {
    // Kurumsal kimliğe göre burayı güncelleyebilirsin
    critical: '#ef4444', // kırmızı
    warning: '#f59e0b',  // amber
    normal: '#06b6d4',   // cyan
    background: '#0b1220',
    grid: 'rgba(255,255,255,0.06)',
    textPrimary: '#ffffff'
  }
};

export const getBrandTheme = (): BrandTheme => {
  // İleride metadata.json veya localStorage üzerinden marka renkleri okunabilir.
  // Şimdilik default döndürüyoruz.
  return defaultTheme;
};
