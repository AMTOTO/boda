import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'KSh' | 'USD' | 'EUR' | 'GBP' | 'ZAR' | 'UGX' | 'TZS';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency?: Currency) => number;
  exchangeRates: Record<Currency, number>;
  currencies: Array<{
    code: Currency;
    name: string;
    symbol: string;
    flag: string;
  }>;
}

const currencies = [
  { code: 'KSh' as Currency, name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
  { code: 'USD' as Currency, name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR' as Currency, name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP' as Currency, name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'ZAR' as Currency, name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'UGX' as Currency, name: 'Ugandan Shilling', symbol: 'UGX', flag: '🇺🇬' },
  { code: 'TZS' as Currency, name: 'Tanzanian Shilling', symbol: 'TZS', flag: '🇹🇿' }
];

// Exchange rates relative to KSh (1 KSh = x currency)
const exchangeRates: Record<Currency, number> = {
  'KSh': 1,
  'USD': 0.0067, // 1 KSh = 0.0067 USD (approximately 150 KSh = 1 USD)
  'EUR': 0.0061, // 1 KSh = 0.0061 EUR
  'GBP': 0.0053, // 1 KSh = 0.0053 GBP
  'ZAR': 0.12,   // 1 KSh = 0.12 ZAR
  'UGX': 24.5,   // 1 KSh = 24.5 UGX
  'TZS': 16.8    // 1 KSh = 16.8 TZS
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
  const [currency, setCurrency] = useState<Currency>('KSh');

  useEffect(() => {
    // Try to get currency from localStorage
    try {
      const savedCurrency = localStorage.getItem('paraboda_currency') as Currency;
      if (savedCurrency && currencies.find(c => c.code === savedCurrency)) {
        setCurrency(savedCurrency);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    try {
      localStorage.setItem('paraboda_currency', newCurrency);
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  const convertAmount = (amount: number, fromCurrency: Currency = 'KSh'): number => {
    // Convert from source currency to KSh first, then to target currency
    const amountInKSh = fromCurrency === 'KSh' ? amount : amount / exchangeRates[fromCurrency];
    return amountInKSh * exchangeRates[currency];
  };

  const formatAmount = (amount: number): string => {
    const convertedAmount = convertAmount(amount);
    const currencyInfo = currencies.find(c => c.code === currency);
    
    if (!currencyInfo) return `${amount}`;

    // Format based on currency
    switch (currency) {
      case 'KSh':
        return `KSh ${convertedAmount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case 'USD':
        return `$${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'EUR':
        return `€${convertedAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'GBP':
        return `£${convertedAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'ZAR':
        return `R${convertedAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'UGX':
        return `UGX ${convertedAmount.toLocaleString('en-UG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case 'TZS':
        return `TZS ${convertedAmount.toLocaleString('en-TZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      default:
        return `${currencyInfo.symbol}${convertedAmount.toLocaleString()}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency: handleSetCurrency,
      formatAmount,
      convertAmount,
      exchangeRates,
      currencies
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};