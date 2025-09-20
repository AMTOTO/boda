import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'KES' | 'UGX' | 'RWF' | 'CDF' | 'USD' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number, currencyOverride?: Currency) => string;
  convertAmount: (amount: number, fromCurrency?: Currency, toCurrency?: Currency) => number;
  exchangeRates: Record<Currency, number>;
  currencies: Array<{
    code: Currency;
    name: string;
    symbol: string;
    flag: string;
    country: string;
  }>;
  getCountryCurrency: (countryCode: string) => Currency;
}

const currencies = [
  { code: 'KES' as Currency, name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', country: 'Kenya' },
  { code: 'UGX' as Currency, name: 'Ugandan Shilling', symbol: 'UGX', flag: '🇺🇬', country: 'Uganda' },
  { code: 'RWF' as Currency, name: 'Rwandan Franc', symbol: 'RWF', flag: '🇷🇼', country: 'Rwanda' },
  { code: 'CDF' as Currency, name: 'Congolese Franc', symbol: 'CDF', flag: '🇨🇩', country: 'DRC' },
  { code: 'USD' as Currency, name: 'US Dollar', symbol: '$', flag: '🇺🇸', country: 'International' },
  { code: 'EUR' as Currency, name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'International' }
];

// Exchange rates relative to KES (1 KES = x currency)
const exchangeRates: Record<Currency, number> = {
  'KES': 1,
  'UGX': 26.5,   // 1 KES = 26.5 UGX
  'RWF': 9.2,    // 1 KES = 9.2 RWF
  'CDF': 19.8,   // 1 KES = 19.8 CDF
  'USD': 0.0067, // 1 KES = 0.0067 USD (approximately 150 KES = 1 USD)
  'EUR': 0.0061  // 1 KES = 0.0061 EUR
};

// Country to currency mapping
const countryCurrencyMap: Record<string, Currency> = {
  'KE': 'KES',
  'UG': 'UGX',
  'RW': 'RWF',
  'CD': 'CDF'
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('KES');

  useEffect(() => {
    // Initialize currency from user profile or localStorage
    const initializeCurrency = () => {
      try {
        // First check user profile for country-based currency
        const userData = localStorage.getItem('paraboda_user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.country) {
            const countryCurrency = getCountryCurrency(user.country);
            setCurrency(countryCurrency);
            return;
          }
        }

        // Then check localStorage
        const savedCurrency = localStorage.getItem('paraboda_currency') as Currency;
        if (savedCurrency && currencies.find(c => c.code === savedCurrency)) {
          setCurrency(savedCurrency);
          return;
        }

        // Default to KES
        setCurrency('KES');
      } catch (error) {
        console.error('Error initializing currency:', error);
        setCurrency('KES');
      }
    };

    initializeCurrency();
  }, []);

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    try {
      localStorage.setItem('paraboda_currency', newCurrency);
      
      // Update user profile if exists
      const userData = localStorage.getItem('paraboda_user');
      if (userData) {
        const user = JSON.parse(userData);
        user.preferredCurrency = newCurrency;
        localStorage.setItem('paraboda_user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  const convertAmount = (amount: number, fromCurrency: Currency = 'KES', toCurrency?: Currency): number => {
    const targetCurrency = toCurrency || currency;
    
    // Convert from source currency to KES first, then to target currency
    const amountInKES = fromCurrency === 'KES' ? amount : amount / exchangeRates[fromCurrency];
    return amountInKES * exchangeRates[targetCurrency];
  };

  const formatAmount = (amount: number, currencyOverride?: Currency): string => {
    const targetCurrency = currencyOverride || currency;
    const convertedAmount = convertAmount(amount, 'KES', targetCurrency);
    const currencyInfo = currencies.find(c => c.code === targetCurrency);
    
    if (!currencyInfo) return `${amount}`;

    // Format based on currency with proper locale
    switch (targetCurrency) {
      case 'KES':
        return `KSh ${convertedAmount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case 'UGX':
        return `UGX ${convertedAmount.toLocaleString('en-UG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case 'RWF':
        return `RWF ${convertedAmount.toLocaleString('en-RW', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case 'CDF':
        return `CDF ${convertedAmount.toLocaleString('fr-CD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case 'USD':
        return `$${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'EUR':
        return `€${convertedAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      default:
        return `${currencyInfo.symbol}${convertedAmount.toLocaleString()}`;
    }
  };

  const getCountryCurrency = (countryCode: string): Currency => {
    return countryCurrencyMap[countryCode] || 'KES';
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency: handleSetCurrency,
      formatAmount,
      convertAmount,
      exchangeRates,
      currencies,
      getCountryCurrency
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};