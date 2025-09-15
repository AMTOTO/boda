import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  color?: string;
  delay?: number;
  isCurrency?: boolean;
  currencyAmount?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon = Activity,
  color = 'emerald',
  delay = 0,
  isCurrency = false,
  currencyAmount
}) => {
  const { formatAmount } = useCurrency();

  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  // Format the display value
  const displayValue = isCurrency && currencyAmount !== undefined 
    ? formatAmount(currencyAmount)
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer active:scale-95"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{displayValue}</p>
          {change && (
            <p className={`text-xs px-2 py-1 rounded-full inline-block mt-2 ${changeColors[changeType]} truncate max-w-full`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${color}-500 rounded-xl flex items-center justify-center flex-shrink-0 ml-3`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};