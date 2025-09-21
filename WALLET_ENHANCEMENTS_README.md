# MSUPU Wallet Enhancements

This document describes the new loan and savings features added to the ParaBoda Health Ecosystem's MSUPU wallet.

## New Components

### 1. Loan Features (`/src/components/wallet/loans/`)

#### MedicalLoanOptions.tsx
- Displays different types of medical and transport loans as clickable cards
- Categories:
  - Emergency Assistance (up to KSh 10,000, 5% interest)
  - Antenatal Care (up to KSh 10,000, 3% interest)
  - Delivery Support (up to KSh 10,000, 4% interest)
  - Maternal Health Services (up to KSh 10,000, 3% interest)
  - Transport to Care Facilities (up to KSh 10,000, 2% interest)
- Each card shows maximum amount, interest rate, and category
- Fully accessible with proper ARIA labels

#### LoanApplicationForm.tsx
- Dynamic form component for loan applications
- Features:
  - Loan amount validation (KSh 1,000 - KSh 10,000)
  - Purpose description
  - Urgency selection (low, medium, high)
  - Repayment period options (1, 3, 6, 12 months)
  - Contact information collection
  - Real-time payment calculation
  - Form validation with error messages
  - Success state with confirmation

#### LoanPaymentForm.tsx
- Handles payments for active loans
- Features:
  - Active loan selection dropdown (includes SHA loans)
  - Payment amount with quick-select buttons
  - Multiple payment methods (M-Pesa, Bank, Cash)
  - Loan details display (remaining balance, monthly payment, due date)
  - Payment validation and processing
  - Success confirmation

### 2. Savings Features

#### AddSavingsForm.tsx
- Comprehensive savings form
- Features:
  - Multiple savings goal categories (emergency, health, education, etc.)
  - Custom goal setting with target amounts
  - Recurring savings option (weekly, monthly, quarterly)
  - Quick amount buttons
  - Multiple payment methods
  - Progress tracking for existing savings

## Dashboard Integration

### Fixed Caregiver Dashboard
The Caregiver Dashboard now has fully functional:

1. **Apply for Loan** - Opens MedicalLoanOptions modal
2. **Add Savings** - Opens AddSavingsForm modal  
3. **Loan Payment** - Opens LoanPaymentForm modal
4. **Credit Report** - Opens CreditReportModal
5. **Loan History** - Shows historical loan data

All buttons are now responsive with proper click handlers and state management.

### New CHV Dashboard
Created comprehensive CHVDashboard.tsx with:

1. **Household Management**
   - View assigned households with risk status
   - Add new households with validation
   - Track visits and SHA enrollment status

2. **Transport Request Management**
   - Create transport requests on behalf of patients
   - Auto-calculate costs (KSh 500 base + KSh 40/km)
   - Approve/reject pending requests

3. **Community Alerts**
   - Submit alerts for maternal emergencies, disease outbreaks, etc.
   - Track alert status and severity levels

4. **Rewards System**
   - Automatic points for CHV activities
   - Higher point allocation (15% of community funds)
   - Activity-based rewards

5. **MSUPU Wallet Integration**
   - Full credit profile with higher trust level
   - All loan and savings features
   - Credit coaching and reporting

## Styling and Design

### New Tailwind Tokens
Extended `tailwind.config.js` with:
- `wallet.*` color schemes for consistent theming
- `loan.*` specific colors for different loan types
- Extended typography and spacing tokens
- Custom shadows and animations

### Accessibility Features
- Minimum button height: `min-h-[48px]`
- High contrast colors for emergency features
- Proper ARIA labels and roles
- Screen reader friendly form validation
- Focus management and keyboard navigation

## Multilingual Support
All components support Swahili and English through:
- `useLanguage()` context hook
- Conditional text rendering
- Localized number formatting
- Cultural considerations for financial terms

## Data Flow

### State Management
- Uses existing `DataContext` for notifications and community funds
- Local state management for form data and UI states
- Proper error handling with user feedback

### Mock Data Integration
- Loan applications create entries in loan history
- Payment processing updates loan balances
- Savings additions update community fund
- CHV activities award points automatically

## Usage Examples

### Caregiver Dashboard
```tsx
// Apply for loan
<button onClick={() => setActiveModal('medicalLoanOptions')}>
  Apply for Loan
</button>

// Add savings
<button onClick={() => setActiveModal('addSavings')}>
  Add Savings
</button>
```

### CHV Dashboard
```tsx
// Approve transport request
<button onClick={() => handleApproveRequest(request.id, true)}>
  Approve
</button>

// Add household
<button onClick={() => setActiveModal('addHousehold')}>
  Add Household
</button>
```

## Future Enhancements
- Real API integration for loan processing
- Advanced household risk assessment
- Automated alert escalation
- Performance analytics for CHVs
- Integration with external health systems

All features maintain the existing ParaBoda design language while introducing modern financial UI patterns optimized for the Kenyan healthcare context.