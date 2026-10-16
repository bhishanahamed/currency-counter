import { calculateCounterTotals, formatCurrencyAmount, amountInWords, buildWhatsAppShareText, normalizeMoney, MAX_QUANTITY, getCurrencyObj } from './src/utils/currencyUtils.js';
import { validateAndSanitizeCounters, validateAndSanitizeHistory, validateAndSanitizeCustomDenoms, validateAndSanitizeSettings } from './src/utils/storage.js';
import { DEFAULT_CURRENCIES } from './src/data/currencies.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log('✓ ' + message);
  } else {
    failed++;
    console.error('✗ ' + message);
  }
}

// 1. Currency catalog test
assert(Object.keys(DEFAULT_CURRENCIES).length >= 10, 'Currencies catalog contains at least 10 world currencies');
const inr = getCurrencyObj('INR');
const usd = getCurrencyObj('USD');
const aed = getCurrencyObj('AED');
assert(inr && inr.symbol === '₹', 'INR symbol is ₹');
assert(usd && usd.symbol === '$', 'USD symbol is $');
assert(aed && aed.symbol === 'د.إ', 'AED symbol is د.إ');

// 2. Calculation logic test
const counterTest = {
  id: 'c1',
  name: 'Counter 1',
  currencyCode: 'INR',
  qtys: { 500: 123456, 100: 50000 },
  expectedStr: '66728000'
};
const stats = calculateCounterTotals(counterTest);
assert(stats.total === 66728000, 'Total calculation is exact: 66,728,000');
assert(stats.notes === 173456, 'Total notes count is 173,456');
assert(stats.diff === 0, 'Difference with matched expected cash is 0');

// 3. Indian & International formatting tests
assert(formatCurrencyAmount(66728000, 'INR') === '6,67,28,000', 'INR formatted with Indian numbering system (Lakh/Crore)');
assert(formatCurrencyAmount(1234567, 'USD') === '1,234,567', 'USD formatted with International comma system');
assert(amountInWords(66728000, 'INR').includes('Crore'), 'Amount in words contains Crore for INR');
assert(amountInWords(1500000, 'USD').includes('Million'), 'Amount in words contains Million for USD');

// 4. WhatsApp formatted report generation test
const waText = buildWhatsAppShareText({
  counter: counterTest,
  currency: inr,
  options: { scope: 'active', includeBreakdown: true, includeTally: true, includeWords: true, includeTimestamp: true }
});
assert(waText.includes('CASH DENOMINATION REPORT'), 'WhatsApp message has report header');
assert(waText.includes('500'), 'WhatsApp message includes breakdown rows');
assert(waText.includes('*Total Amount:* ₹6,67,28,000'), 'WhatsApp message includes exact formatted total');
assert(waText.includes('*Difference:* ₹0 (Matched ✅)'), 'WhatsApp message includes matched tally');

// 5. Storage sanitization and boundaries test
const sanitized = validateAndSanitizeCounters([{
  id: 'c1',
  name: 'Valid Counter',
  currencyCode: 'INR',
  qtys: { 500: 123456 },
  expectedStr: '50000'
}]);
assert(sanitized.length === 1 && sanitized[0].qtys[500] === 123456, 'Storage accepts 6-digit quantities up to MAX_QUANTITY');
assert(sanitized[0].expectedStr === '50000', 'Storage preserves valid expected cash string');

const customDenomTest = validateAndSanitizeCustomDenoms({
  INR: [{ value: 2000, label: 'Pink Note' }]
});
assert(customDenomTest.INR.length === 1 && customDenomTest.INR[0].value === 2000, 'Custom denominations sanitized and preserved');

const settingsTest = validateAndSanitizeSettings({
  darkMode: true,
  defaultCurrencyCode: 'INR'
});
assert(settingsTest.darkMode === true && settingsTest.defaultCurrencyCode === 'INR', 'Settings sanitization works');

console.log(`\n========================================`);
console.log(`ALL TESTS PASSED: ${passed}/${passed + failed}`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
