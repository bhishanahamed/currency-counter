import { CURRENCY_CONFIG } from '../data/currencies.js';

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

/**
 * Converts integer numbers below 1000 into words.
 * Safely guards against large or out-of-range values.
 */
function convertBelowThousand(num) {
  let val = Math.floor(num);
  if (val <= 0) return "";

  if (val >= 1000) {
    return convertInternationalNumber(val);
  }

  let words = "";
  const hundreds = Math.floor(val / 100);
  if (hundreds > 0 && hundreds < 20) {
    words += ONES[hundreds] + " Hundred";
    val %= 100;
    if (val > 0) words += " ";
  }

  if (val > 0) {
    if (val < 20) {
      words += ONES[val];
    } else {
      words += TENS[Math.floor(val / 10)];
      if (val % 10 > 0) {
        words += " " + ONES[val % 10];
      }
    }
  }

  return words.trim();
}

/**
 * Maximum supported amount for full Indian verbal conversion (999 Crore 99 Lakh 99,999.99).
 * Amounts exceeding this threshold return a safe formatted numeric fallback with currency unit
 * to avoid malformed or repeated scale names (e.g. "Crore Crore").
 */
export const MAX_INDIAN_WORDS_AMOUNT = 9999999999.99;

/**
 * Converts integer number using Indian numbering system (Crore, Lakh, Thousand).
 * Uses convertBelowThousand for the Crore scale to ensure no repeated scale names
 * such as "Crore Crore" can ever be generated.
 */
function convertIndianNumber(num) {
  let val = Math.floor(num);
  if (val <= 0) return "";

  if (val > MAX_INDIAN_WORDS_AMOUNT) {
    return new Intl.NumberFormat("en-IN").format(val);
  }

  const crore = Math.floor(val / 10000000);
  val %= 10000000;
  const lakh = Math.floor(val / 100000);
  val %= 100000;
  const thousand = Math.floor(val / 1000);
  val %= 1000;
  const remainder = val;

  const parts = [];
  if (crore > 0) {
    // Convert crore using convertBelowThousand so it cannot recursively generate "Crore"
    parts.push(convertBelowThousand(crore) + " Crore");
  }
  if (lakh > 0) {
    parts.push(convertBelowThousand(lakh) + " Lakh");
  }
  if (thousand > 0) {
    parts.push(convertBelowThousand(thousand) + " Thousand");
  }
  if (remainder > 0) {
    parts.push(convertBelowThousand(remainder));
  }

  return parts.join(" ").trim();
}

/**
 * Converts integer number using International numbering system
 * Supports: Quadrillion, Trillion, Billion, Million, Thousand
 * Avoids invalid output such as "undefined Million" or "Ten Hundred Billion".
 */
function convertInternationalNumber(num) {
  let val = Math.floor(num);
  if (val === 0) return "";

  const scales = [
    { limit: 1000000000000000, name: "Quadrillion" },
    { limit: 1000000000000, name: "Trillion" },
    { limit: 1000000000, name: "Billion" },
    { limit: 1000000, name: "Million" },
    { limit: 1000, name: "Thousand" }
  ];

  const parts = [];

  for (const scale of scales) {
    const unitCount = Math.floor(val / scale.limit);
    if (unitCount > 0) {
      parts.push(convertBelowThousand(unitCount) + " " + scale.name);
      val %= scale.limit;
    }
  }

  if (val > 0) {
    parts.push(convertBelowThousand(val));
  }

  return parts.join(" ").trim();
}

/**
 * Currency-aware number to words formatter with fractional currency support.
 * Correctly converts both whole and decimal amounts.
 *
 * Normal amounts:
 * - INR 1.00     => "One Rupee Only"
 * - INR 1.50     => "One Rupee and Fifty Paise Only"
 * - INR 100      => "One Hundred Rupees Only"
 * - INR 100000   => "One Lakh Rupees Only"
 * - INR 10000000 => "One Crore Rupees Only"
 * - USD 1.50     => "One Dollar and Fifty Cents Only"
 * - USD 0.25     => "Twenty Five Cents Only"
 * - USD 1000000000 => "One Billion Dollars Only"
 * - GBP 1.00     => "One Pound Only"
 * - JPY 500      => "Five Hundred Yen Only"
 */
export function amountInWords(amount, currencyCode = "INR") {
  const num = Number(amount);
  if (isNaN(num) || num < 0) return "";

  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.INR;
  const isIndian = config.numberingSystem === "indian";

  // Normalize according to currency decimal rules
  const rounded = config.decimals === 0 ? Math.round(num) : Math.round(num * 100) / 100;
  const majorValue = Math.floor(rounded);
  const minorValue = config.decimals > 0 ? Math.round((rounded - majorValue) * 100) : 0;

  const majorUnit = majorValue === 1 ? config.majorUnitSingular : config.majorUnitPlural;
  const minorUnit = minorValue === 1 ? config.minorUnitSingular : config.minorUnitPlural;

  // Case 1: Exactly zero
  if (majorValue === 0 && minorValue === 0) {
    return `Zero ${config.majorUnitPlural} Only`;
  }

  // Safe fallback for extreme INR values exceeding supported Indian verbal range to prevent malformed words like "Crore Crore"
  if (isIndian && num > MAX_INDIAN_WORDS_AMOUNT) {
    const formatted = new Intl.NumberFormat(config.locale || "en-IN").format(majorValue);
    if (minorValue > 0) {
      const minorWords = convertBelowThousand(minorValue);
      return `${formatted} ${majorUnit} and ${minorWords} ${minorUnit} Only`;
    }
    return `${formatted} ${majorUnit} Only`;
  }

  const convertFn = isIndian ? convertIndianNumber : convertInternationalNumber;

  // Case 2: Only minor unit (e.g. 0.50 -> "Fifty Paise Only" or "Fifty Cents Only")
  if (majorValue === 0 && minorValue > 0) {
    const minorWords = convertBelowThousand(minorValue);
    return `${minorWords} ${minorUnit} Only`.trim();
  }

  // Major words
  const majorWords = convertFn(majorValue);

  // Case 3: Only major unit (e.g. 100.00 -> "One Hundred Rupees Only")
  if (minorValue === 0) {
    return `${majorWords} ${majorUnit} Only`.trim();
  }

  // Case 4: Both major and minor units (e.g. 1.50 -> "One Rupee and Fifty Paise Only")
  const minorWords = convertBelowThousand(minorValue);
  return `${majorWords} ${majorUnit} and ${minorWords} ${minorUnit} Only`.trim();
}
