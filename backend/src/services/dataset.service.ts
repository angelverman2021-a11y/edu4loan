import path from 'path';
import { parseCSV } from '../utils/csvParser';

const DATASET_DIR = path.resolve(__dirname, '../../../dataset');

export class DatasetService {
  static getBanks() {
    return parseCSV(path.join(DATASET_DIR, 'banks', 'banks.csv'));
  }

  static getLoanTypes() {
    return parseCSV(path.join(DATASET_DIR, 'reference', 'loan_types.csv'));
  }

  static getLoanProducts(loanType: string) {
    const filename = `${loanType.toLowerCase()}_loans.csv`;
    return parseCSV(path.join(DATASET_DIR, 'loan_products', filename));
  }

  static getInterestRates() {
    return parseCSV(path.join(DATASET_DIR, 'pricing', 'interest_rates.csv'));
  }

  static getCustomerReviews() {
    return parseCSV(path.join(DATASET_DIR, 'experiences', 'customer_reviews.csv'));
  }

  static getLoanFees() {
    return parseCSV(path.join(DATASET_DIR, 'fees', 'loan_fees.csv'));
  }

  static calculateEMI(principal: number, annualRate: number, tenureMonths: number) {
    if (!principal || !annualRate || !tenureMonths) return 0;
    const r = (annualRate / 12) / 100;
    const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
    return Math.round(emi);
  }

  static compareLoans(loanProductIds: string[], loanAmount: number, tenureMonths: number) {
    const allRates = this.getInterestRates();
    const allReviews = this.getCustomerReviews();
    const allFees = this.getLoanFees();
    const allBanks = this.getBanks();

    const allProducts = [
      ...this.getLoanProducts('education'),
      ...this.getLoanProducts('personal'),
      ...this.getLoanProducts('home'),
      ...this.getLoanProducts('vehicle'),
      ...this.getLoanProducts('business'),
      ...this.getLoanProducts('gold')
    ];

    const results = loanProductIds.map(id => {
      const product = allProducts.find(p => p.loan_product_id === id);
      if (!product) return null;

      const bank = allBanks.find(b => b.bank_id === product.bank_id);
      const rates = allRates.find(r => r.loan_product_id === id);
      
      const interestRate = rates ? parseFloat(rates.interest_rate_min) : 8.5; // fallback
      const emi = this.calculateEMI(loanAmount, interestRate, tenureMonths);
      const totalRepayment = emi * tenureMonths;
      const totalInterest = totalRepayment - loanAmount;

      const productReviews = allReviews.filter(r => r.loan_product_id === id);
      let avgRating = 0;
      if (productReviews.length > 0) {
        const sum = productReviews.reduce((acc, r) => acc + parseFloat(r.rating || '0'), 0);
        avgRating = sum / productReviews.length;
      } else {
        avgRating = 3.5; // fallback
      }

      const fees = allFees.filter(f => f.loan_product_id === id);
      const processingFeeRecord = fees.find(f => f.fee_type === 'Processing');
      let processingFeeAmount = 0;
      if (processingFeeRecord) {
         if (parseFloat(processingFeeRecord.fee_amount) > 0) {
             processingFeeAmount = parseFloat(processingFeeRecord.fee_amount);
         } else if (parseFloat(processingFeeRecord.fee_percentage) > 0) {
             processingFeeAmount = loanAmount * (parseFloat(processingFeeRecord.fee_percentage) / 100);
         }
      }

      // Generate a simple recommendation score based on interest rate, fees, and customer rating
      // lower interest is better, lower fee is better, higher rating is better
      const normalizedRate = Math.max(0, 100 - (interestRate * 5)); // 10% rate -> 50 score
      const normalizedRating = avgRating * 20; // 5 stars -> 100 score
      const normalizedFee = Math.max(0, 100 - (processingFeeAmount / loanAmount * 1000)); 

      const eligibilityScore = Math.round((normalizedRate * 0.4) + (normalizedRating * 0.4) + (normalizedFee * 0.2));

      return {
        id,
        bankName: bank ? bank.bank_name : product.bank_id,
        productName: product.product_name,
        interestRate,
        emi,
        totalInterest,
        processingFee: Math.round(processingFeeAmount),
        customerExperience: Math.round(avgRating * 10) / 10,
        eligibilityScore
      };
    }).filter(Boolean);

    return results;
  }
}
