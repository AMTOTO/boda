import { useCurrency } from '../contexts/CurrencyContext';

export type PaymentMethod = 'mpesa' | 'mtn_money' | 'airtel_money' | 'bank_transfer' | 'cash';
export type TransactionType = 'deposit' | 'withdrawal' | 'loan_payment' | 'loan_disbursement' | 'savings' | 'contribution' | 'reward' | 'sha_payment';
export type LoanStatus = 'pending' | 'approved' | 'active' | 'completed' | 'overdue' | 'rejected';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface Loan {
  id: string;
  userId: string;
  loanType: string;
  amount: number;
  currency: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  remainingBalance: number;
  status: LoanStatus;
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  nextPaymentDate?: Date;
  purpose: string;
  collateral?: string;
  guarantor?: string;
}

export interface SavingsAccount {
  id: string;
  userId: string;
  accountType: 'personal' | 'community' | 'group';
  balance: number;
  currency: string;
  interestRate: number;
  minimumBalance: number;
  lastTransactionDate: Date;
  createdDate: Date;
}

export interface CreditProfile {
  userId: string;
  creditScore: number;
  trustLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  eligibilityStatus: 'approved' | 'pending' | 'denied' | 'not_assessed';
  loanReadiness: number; // 0-100 percentage
  totalLoans: number;
  completedLoans: number;
  overdueLoans: number;
  totalSavings: number;
  communityParticipation: number;
  lastAssessment: Date;
}

class WalletService {
  private transactions: Transaction[] = [];
  private loans: Loan[] = [];
  private savingsAccounts: SavingsAccount[] = [];
  private creditProfiles: Map<string, CreditProfile> = new Map();

  // Initialize with mock data
  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock transactions
    this.transactions = [
      {
        id: 'txn_001',
        userId: 'preview-community',
        type: 'deposit',
        amount: 1000,
        currency: 'KES',
        paymentMethod: 'mpesa',
        description: 'Monthly savings contribution',
        status: 'completed',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        reference: 'MPESA_001'
      },
      {
        id: 'txn_002',
        userId: 'preview-community',
        type: 'loan_payment',
        amount: 500,
        currency: 'KES',
        paymentMethod: 'mpesa',
        description: 'Medical loan payment',
        status: 'completed',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        reference: 'MPESA_002'
      }
    ];

    // Mock loans
    this.loans = [
      {
        id: 'loan_001',
        userId: 'preview-community',
        loanType: 'Medical Emergency',
        amount: 5000,
        currency: 'KES',
        interestRate: 5,
        termMonths: 6,
        monthlyPayment: 900,
        remainingBalance: 2700,
        status: 'active',
        applicationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        approvalDate: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000),
        disbursementDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
        nextPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        purpose: 'Emergency medical treatment'
      }
    ];

    // Mock savings accounts
    this.savingsAccounts = [
      {
        id: 'savings_001',
        userId: 'preview-community',
        accountType: 'personal',
        balance: 8500,
        currency: 'KES',
        interestRate: 3,
        minimumBalance: 100,
        lastTransactionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        createdDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      }
    ];

    // Mock credit profiles
    this.creditProfiles.set('preview-community', {
      userId: 'preview-community',
      creditScore: 720,
      trustLevel: 'gold',
      eligibilityStatus: 'approved',
      loanReadiness: 85,
      totalLoans: 3,
      completedLoans: 2,
      overdueLoans: 0,
      totalSavings: 8500,
      communityParticipation: 90,
      lastAssessment: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    });
  }

  // Transaction methods
  async createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}`,
      timestamp: new Date(),
      status: 'pending'
    };

    this.transactions.unshift(newTransaction);
    
    // Simulate payment processing
    setTimeout(() => {
      this.updateTransactionStatus(newTransaction.id, 'completed');
    }, 2000);

    return newTransaction;
  }

  async updateTransactionStatus(transactionId: string, status: Transaction['status']): Promise<void> {
    const index = this.transactions.findIndex(t => t.id === transactionId);
    if (index !== -1) {
      this.transactions[index].status = status;
    }
  }

  getTransactionHistory(userId: string, limit?: number): Transaction[] {
    const userTransactions = this.transactions.filter(t => t.userId === userId);
    return limit ? userTransactions.slice(0, limit) : userTransactions;
  }

  // Loan methods
  async applyForLoan(loanApplication: Omit<Loan, 'id' | 'status' | 'applicationDate' | 'remainingBalance'>): Promise<Loan> {
    const newLoan: Loan = {
      ...loanApplication,
      id: `loan_${Date.now()}`,
      status: 'pending',
      applicationDate: new Date(),
      remainingBalance: loanApplication.amount
    };

    this.loans.unshift(newLoan);
    return newLoan;
  }

  async approveLoan(loanId: string): Promise<void> {
    const index = this.loans.findIndex(l => l.id === loanId);
    if (index !== -1) {
      this.loans[index].status = 'approved';
      this.loans[index].approvalDate = new Date();
    }
  }

  async disburseLoan(loanId: string): Promise<void> {
    const index = this.loans.findIndex(l => l.id === loanId);
    if (index !== -1) {
      this.loans[index].status = 'active';
      this.loans[index].disbursementDate = new Date();
      
      // Calculate next payment date (30 days from disbursement)
      const nextPayment = new Date();
      nextPayment.setDate(nextPayment.getDate() + 30);
      this.loans[index].nextPaymentDate = nextPayment;
    }
  }

  async makeLoanPayment(loanId: string, amount: number, paymentMethod: PaymentMethod): Promise<Transaction> {
    const loanIndex = this.loans.findIndex(l => l.id === loanId);
    if (loanIndex === -1) {
      throw new Error('Loan not found');
    }

    const loan = this.loans[loanIndex];
    
    // Create payment transaction
    const transaction = await this.createTransaction({
      userId: loan.userId,
      type: 'loan_payment',
      amount,
      currency: loan.currency,
      paymentMethod,
      description: `Payment for ${loan.loanType}`,
      reference: `LOAN_PAY_${Date.now()}`
    });

    // Update loan balance
    loan.remainingBalance = Math.max(0, loan.remainingBalance - amount);
    
    // Update next payment date
    if (loan.remainingBalance > 0) {
      const nextPayment = new Date();
      nextPayment.setDate(nextPayment.getDate() + 30);
      loan.nextPaymentDate = nextPayment;
    } else {
      loan.status = 'completed';
      loan.nextPaymentDate = undefined;
    }

    return transaction;
  }

  getUserLoans(userId: string, status?: LoanStatus): Loan[] {
    let userLoans = this.loans.filter(l => l.userId === userId);
    if (status) {
      userLoans = userLoans.filter(l => l.status === status);
    }
    return userLoans.sort((a, b) => b.applicationDate.getTime() - a.applicationDate.getTime());
  }

  // Savings methods
  async createSavingsAccount(account: Omit<SavingsAccount, 'id' | 'createdDate' | 'lastTransactionDate'>): Promise<SavingsAccount> {
    const newAccount: SavingsAccount = {
      ...account,
      id: `savings_${Date.now()}`,
      createdDate: new Date(),
      lastTransactionDate: new Date()
    };

    this.savingsAccounts.push(newAccount);
    return newAccount;
  }

  async addToSavings(userId: string, amount: number, paymentMethod: PaymentMethod): Promise<Transaction> {
    // Find user's savings account
    const savingsAccount = this.savingsAccounts.find(s => s.userId === userId && s.accountType === 'personal');
    
    if (!savingsAccount) {
      throw new Error('Savings account not found');
    }

    // Create deposit transaction
    const transaction = await this.createTransaction({
      userId,
      type: 'savings',
      amount,
      currency: savingsAccount.currency,
      paymentMethod,
      description: 'Savings deposit',
      reference: `SAVINGS_${Date.now()}`
    });

    // Update savings balance
    savingsAccount.balance += amount;
    savingsAccount.lastTransactionDate = new Date();

    return transaction;
  }

  getUserSavings(userId: string): SavingsAccount | null {
    return this.savingsAccounts.find(s => s.userId === userId && s.accountType === 'personal') || null;
  }

  // Credit profile methods
  getCreditProfile(userId: string): CreditProfile | null {
    return this.creditProfiles.get(userId) || null;
  }

  async updateCreditScore(userId: string): Promise<CreditProfile> {
    const userLoans = this.getUserLoans(userId);
    const userSavings = this.getUserSavings(userId);
    const userTransactions = this.getTransactionHistory(userId);

    // Calculate credit score based on various factors
    let score = 300; // Base score

    // Payment history (40% of score)
    const completedLoans = userLoans.filter(l => l.status === 'completed').length;
    const overdueLoans = userLoans.filter(l => l.status === 'overdue').length;
    const paymentHistoryScore = Math.min(200, (completedLoans * 50) - (overdueLoans * 100));
    score += paymentHistoryScore;

    // Savings balance (30% of score)
    const savingsBalance = userSavings?.balance || 0;
    const savingsScore = Math.min(150, savingsBalance / 100); // 1 point per 100 KES
    score += savingsScore;

    // Transaction frequency (20% of score)
    const recentTransactions = userTransactions.filter(t => 
      t.timestamp.getTime() > Date.now() - 90 * 24 * 60 * 60 * 1000
    ).length;
    const activityScore = Math.min(100, recentTransactions * 10);
    score += activityScore;

    // Community participation (10% of score)
    const communityScore = 50; // Mock community participation score
    score += communityScore;

    // Cap at 850
    score = Math.min(850, score);

    // Determine trust level
    let trustLevel: CreditProfile['trustLevel'] = 'bronze';
    if (score >= 750) trustLevel = 'platinum';
    else if (score >= 650) trustLevel = 'gold';
    else if (score >= 550) trustLevel = 'silver';

    // Determine eligibility status
    let eligibilityStatus: CreditProfile['eligibilityStatus'] = 'not_assessed';
    if (score >= 600) eligibilityStatus = 'approved';
    else if (score >= 500) eligibilityStatus = 'pending';
    else eligibilityStatus = 'denied';

    // Calculate loan readiness
    const loanReadiness = Math.min(100, (score - 300) / 5.5);

    const creditProfile: CreditProfile = {
      userId,
      creditScore: Math.round(score),
      trustLevel,
      eligibilityStatus,
      loanReadiness: Math.round(loanReadiness),
      totalLoans: userLoans.length,
      completedLoans,
      overdueLoans,
      totalSavings: savingsBalance,
      communityParticipation: 90,
      lastAssessment: new Date()
    };

    this.creditProfiles.set(userId, creditProfile);
    return creditProfile;
  }

  // Mobile money integration methods
  async initiateMpesaPayment(phoneNumber: string, amount: number, reference: string): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    // Mock M-Pesa integration
    return new Promise((resolve) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve({
            success: true,
            transactionId: `MPESA_${Date.now()}`
          });
        } else {
          resolve({
            success: false,
            error: 'Payment failed. Please try again.'
          });
        }
      }, 3000);
    });
  }

  async initiateMtnMoneyPayment(phoneNumber: string, amount: number, reference: string): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    // Mock MTN Mobile Money integration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `MTN_${Date.now()}`
        });
      }, 2500);
    });
  }

  async initiateAirtelMoneyPayment(phoneNumber: string, amount: number, reference: string): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    // Mock Airtel Money integration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `AIRTEL_${Date.now()}`
        });
      }, 2000);
    });
  }

  // SHA (Social Health Insurance) methods
  async contributeSHA(userId: string, amount: number, paymentMethod: PaymentMethod): Promise<Transaction> {
    const transaction = await this.createTransaction({
      userId,
      type: 'sha_payment',
      amount,
      currency: 'KES', // SHA is typically in local currency
      paymentMethod,
      description: 'SHA contribution payment',
      reference: `SHA_${Date.now()}`,
      metadata: {
        shaContribution: true,
        contributionYear: new Date().getFullYear()
      }
    });

    return transaction;
  }

  async requestSHALoan(userId: string, amount: number, purpose: string): Promise<Loan> {
    const loan = await this.applyForLoan({
      userId,
      loanType: 'SHA Contribution Loan',
      amount,
      currency: 'KES',
      interestRate: 2, // Lower interest for SHA loans
      termMonths: 12,
      monthlyPayment: this.calculateMonthlyPayment(amount, 2, 12),
      purpose,
      collateral: 'SHA membership'
    });

    return loan;
  }

  // Utility methods
  private calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / termMonths;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
           (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  // Analytics methods
  getWalletSummary(userId: string): {
    totalBalance: number;
    totalSavings: number;
    totalLoans: number;
    activeLoans: number;
    creditScore: number;
    monthlyIncome: number;
    monthlyExpenses: number;
  } {
    const savings = this.getUserSavings(userId);
    const loans = this.getUserLoans(userId);
    const activeLoans = loans.filter(l => l.status === 'active');
    const creditProfile = this.getCreditProfile(userId);
    const recentTransactions = this.getTransactionHistory(userId, 30);

    const monthlyIncome = recentTransactions
      .filter(t => ['deposit', 'reward', 'savings'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = recentTransactions
      .filter(t => ['withdrawal', 'loan_payment'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance: savings?.balance || 0,
      totalSavings: savings?.balance || 0,
      totalLoans: loans.length,
      activeLoans: activeLoans.length,
      creditScore: creditProfile?.creditScore || 300,
      monthlyIncome,
      monthlyExpenses
    };
  }

  // Export transaction history
  async exportTransactionHistory(userId: string, format: 'csv' | 'json' = 'csv'): Promise<string> {
    const transactions = this.getTransactionHistory(userId);
    
    if (format === 'json') {
      return JSON.stringify(transactions, null, 2);
    }

    // CSV format
    const headers = ['Date', 'Type', 'Amount', 'Currency', 'Payment Method', 'Description', 'Status', 'Reference'];
    const rows = transactions.map(t => [
      t.timestamp.toISOString(),
      t.type,
      t.amount.toString(),
      t.currency,
      t.paymentMethod,
      t.description,
      t.status,
      t.reference || ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Offline transaction queue
  private offlineQueue: Transaction[] = [];

  queueOfflineTransaction(transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>): void {
    const queuedTransaction: Transaction = {
      ...transaction,
      id: `offline_${Date.now()}`,
      timestamp: new Date(),
      status: 'pending'
    };

    this.offlineQueue.push(queuedTransaction);
    
    // Store in localStorage for persistence
    try {
      localStorage.setItem('paraboda_offline_transactions', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Error storing offline transaction:', error);
    }
  }

  async syncOfflineTransactions(): Promise<void> {
    if (this.offlineQueue.length === 0) return;

    try {
      // Process each queued transaction
      for (const transaction of this.offlineQueue) {
        await this.createTransaction(transaction);
      }

      // Clear the queue
      this.offlineQueue = [];
      localStorage.removeItem('paraboda_offline_transactions');
    } catch (error) {
      console.error('Error syncing offline transactions:', error);
    }
  }

  // Load offline queue on initialization
  loadOfflineQueue(): void {
    try {
      const stored = localStorage.getItem('paraboda_offline_transactions');
      if (stored) {
        this.offlineQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }
}

export const walletService = new WalletService();

// Load offline queue on service initialization
walletService.loadOfflineQueue();

// Auto-sync when coming online
window.addEventListener('online', () => {
  walletService.syncOfflineTransactions();
});