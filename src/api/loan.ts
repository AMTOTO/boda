interface SHALoanRequest {
  caregiverId: string;
  loanType: string;
  amount: string;
  coverageType: string;
  repaymentPlan: string;
  notes: string;
}

interface SHALoanResponse {
  success: boolean;
  loanId?: string;
  message: string;
  expectedProcessingTime?: string;
}

export const requestSHALoan = async (requestData: SHALoanRequest): Promise<SHALoanResponse> => {
  // Mock API call - replace with actual API endpoint
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate for demo
        resolve({
          success: true,
          loanId: `SHA_${Date.now()}`,
          message: 'SHA loan request submitted successfully',
          expectedProcessingTime: '24-48 hours'
        });
      } else {
        reject(new Error('Failed to submit SHA loan request'));
      }
    }, 2000);
  });
};

// Additional loan-related API functions can be added here
export const getLoanHistory = async (caregiverId: string) => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        loans: [
          {
            id: 'SHA_123456',
            type: 'SHA Contribution Loan',
            amount: 15000,
            status: 'approved',
            dateApplied: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            coverageType: 'antenatal_care'
          }
        ]
      });
    }, 1000);
  });
};

export const getLoanStatus = async (loanId: string) => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        loanId,
        status: 'under_review',
        estimatedDecision: '2024-01-20',
        nextSteps: 'Awaiting documentation review'
      });
    }, 1000);
  });
};