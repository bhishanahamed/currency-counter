// Flag base64 data URIs extracted from original code
export const FLAGS = {
  in: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAIAAAAt2Q6oAAAA3UlEQVR4nO2WQQrDIBBFZ0oX3ecovVx2iTuv0EP2DD8LQSQopfE7QZi3Uhfm8fkOUXzeMhuPuwWu4NJWuLQVLm2FS1vh0lZMKa0A7nb4m+eIS1VDuQU28gfARmRvLViQO60aqrmesu+FGEBK9BTwiLxpSeeMga2aa+v8AkNGXvZrtaUT5vSoBklus4hwpctQs2v1sBN+PVTDz373wnrRAET2ckS0xkg/zKRbby7lTXyR5HpU+0CfIbrEF/G6xHddy+0SI/f+IdKjmfJ/2qWtcGkrXNoKl7bCpa2YUvoAa/Y0Ct3QxSgAAAAASUVORK5CYII=",
  us: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAIAAAAt2Q6oAAAAu0lEQVR4nO2UwQ2CQBBFHWMl0AKehBJsBW/0QStagsYLNXCmjPVggkrIBMz3m0n+O242M38ns8/KQ70B0Qx3VCmfLacNlo/Q11s7e2nt+a+xcT3GBFV5er+x/Jz2htekn70nyb44J2DAj0ib9A5Y65LvgdUcZA8WsgcL2UP2cJA9ZA8H2UP2cAgZGrkex74DVnOwlBKnE5CQ62HnrPh3htWEnHTI0PqILEKGlj1YhAwte7AIGVr2YKHQLB4jTmSPqkQa8AAAAABJRU5ErkJggg==",
  eu: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAIAAAAt2Q6oAAAA0klEQVR4nO2YQQ6FQAhDR/Nv5KHmTHNa/8LEGHWBbcEY6MqF4kttGHBqy2hf0/w2AKKCjlJBR8kLeh19Hd2puAv0juvErYG2+Cr0XgB99XXq43Sh9f7Hl7jVjushgdNXX7F7HrwRnj22D41BMM822Gkmo3y+Mx0uTEb5fOOZflFp4qE62+A6j6FVZxtTJ0c8VGcb1X+qewQJh2Z6CNl/avaIUuLZwzIfkzP0US47InaPXVn/e1h2b+2OqNnGLSjC/dwlHlpfb+rX7BGkgo5SQUfpD5p6fApOjeaaAAAAAElFTkSuQmCC",
  gb: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAIAAAAt2Q6oAAABk0lEQVR4nO2ZwU3EMBBFf6wUQEqAAuCIolQEBdHRauFIA7SQDgiHSKNoxo7tGcdOJN5p8cbO2yexOwvd58MzAADjMMHM788HgK/hZbv4On8DcE/v9vPv8w1Az34uon4Eq96KY5bb584Ds3IQde/z7TzqUmYcJkePTphc6q6Sjq2yPa3UvYHpsWNXnyF5KDDBpek6dkod9f3AhF8aLZJHAxNBadrJzj1CPTEwEZHG8cnTAxNxaTqL3cmunhuYSJVG6eSKwESGNJ3O7p2rrg5MZEvDltwSmOjjlwQYh2lrEPWWF6gnym5ZFt1OQk7PKSuWOxaQhvDex2gMoKNvLhdC84vYnH/pWlxS+pLvHgVKR9+D2UrWK/TSdY9v6s3yQ271874M6ar+RNSXzp0iCg6JGmnLmFZkLs+Wto9p9uQZ0vY5eGdvVvJU6SJzMEOdPC5dNrBEkTwifURgSW7yoPTRgSXpyf3SdQJLEpNz6fqBJdHkjj3NNrf6b8Z+ckdLzQNLQsl7+ALXNNtnlWF/q3BnNiaY1R8KrSpf3HOLggAAAABJRU5ErkJggg==",
  jp: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAIAAAAt2Q6oAAAAsElEQVR4nO3XUQqFIBSEYY3W0yZad5toQ/bQS1DQ0RlGxPkfL3X7OEhpLqWk0Vp6A1oyWpXRqoxWZbSqlf6PR97eP+7lJD4iEz/jn9xnLDptefyKg9dE4qDjGoqbgK514G4U3SYA3UO+8iA0MjDk3vkm3SujVRmtCkIjGyDk3vkmnVoHBu5RCZOuFeC7as7yiDso5wDamo5oWCcX5nHrbrAzoqwpX3ldMlqV0aqMVnUBx/QzQyan36sAAAAASUVORK5CYII=",
  au: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAIAAAAt2Q6oAAAAlElEQVR4nO3WTQ5AMBRGUW1shN2xIMuzFDVoIgY01eqVF98ZiQQ3TX84N0xdnm1d4oUf58xHGvHffr6MoimKpiiaYjLahRDavb3RMWRypE1GO/17QBRNUTRF0ZSe/2T9fv/gcKl35J4VpJucHlz05TAn7idopClc9N2C+8tCRLe8yNg+/RaT00PRFEVTFE1RNMVk9A5OoBuP80FqGwAAAABJRU5ErkJggg==",
  ca: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAIAAAAt2Q6oAAAAoklEQVR4nO3YMQ6AIBBEUfH+d8aChkggbDJ/qvm1xYsRkG39qdRrjxdq7f7Zl0KQBe0qaFdBuwraVdCugv5V+QcqhaGHmHEz6NkKuAH0qlS7sxCf/UuVvmwp+izTuXXoG5PIrUPf3HlF92Lp53E26W7y6oW4k0lnD8CWt/rU0xJmn56VwHwHO1yGlZlIkSciNkPLMe4qaFdBuwraVdCugnb1AXPLHU+Uc2QiAAAAAElFTkSuQmCC",
  ae: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAIAAAAt2Q6oAAAAZUlEQVR4nO3WwQnAMAwEQSsNpTj3j1PDBbRGsPPWY7mX6qxA7Tc57/LcDvjDaIrRFKMpRlOMpoyMruhhWic7bzJyaaMpRlOMphhNMZoyMjp7mKorIzNyaaMpRlOMphhNMZpiNOUDEMoF7ZwkiiMAAAAASUVORK5CYII=",
  sa: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAIAAAAt2Q6oAAAAc0lEQVR4nO3XsQ2AMAwAQRuxEkwF07AVS0GfKgHxyNJf7eLlJk7GtkQ1098BTxhNMZpiNMVoitGUktHz0PR1nB91RETua+dkyU0bTTGaYjQl/dhCjKaUjB47mBov76f+C6lRctNGU3xcKEZTjKYYTTGacgOqHQg1m1no9QAAAABJRU5ErkJggg==",
  sg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAIAAAAt2Q6oAAAAzklEQVR4nO2X2w2DMAxFSdUJ2KLdgO4vRmCLdoX0AylCkRMgti9BuucrH1g6XNl5hO9rGu7G42qBFiiN4rn7xbjM6+L3/jjLHKUm3aw7LrPrHxbbQ2O8LfdAlta0xFqSCj3sXQYxMzb3FqTbYhbNstStsEm6kqjHRNpIVxLtuqcrxoie1pNNhXmHBPGWp9nyACeofdJO6W6Rkx66vHIkikm7HmlKikknOox8X7pDQozxaofT3PLlQmkUlEZBaRSURkFpFJRGQWkUlEZBaRR/IzlQKYxf1WYAAAAASUVORK5CYII="
};

export const DEFAULT_CURRENCIES = {
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳", flagSrc: FLAGS.in, flagCode: "in", denoms: [500, 200, 100, 50, 20, 10, 5, 2, 1] },
  USD: { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸", flagSrc: FLAGS.us, flagCode: "us", denoms: [100, 50, 20, 10, 5, 2, 1] },
  EUR: { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", flagSrc: FLAGS.eu, flagCode: "eu", denoms: [500, 200, 100, 50, 20, 10, 5, 2, 1] },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧", flagSrc: FLAGS.gb, flagCode: "gb", denoms: [50, 20, 10, 5, 2, 1] },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵", flagSrc: FLAGS.jp, flagCode: "jp", denoms: [10000, 5000, 2000, 1000, 500, 100, 50, 10, 5, 1] },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺", flagSrc: FLAGS.au, flagCode: "au", denoms: [100, 50, 20, 10, 5, 2, 1] },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦", flagSrc: FLAGS.ca, flagCode: "ca", denoms: [100, 50, 20, 10, 5, 2, 1] },
  AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪", flagSrc: FLAGS.ae, flagCode: "ae", denoms: [1000, 500, 200, 100, 50, 20, 10, 5] },
  SAR: { code: "SAR", symbol: "﷼", name: "Saudi Riyal", flag: "🇸🇦", flagSrc: FLAGS.sa, flagCode: "sa", denoms: [500, 200, 100, 50, 20, 10, 5, 1] },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar", flag: "🇸🇬", flagSrc: FLAGS.sg, flagCode: "sg", denoms: [10000, 1000, 100, 50, 10, 5, 2] }
};

export const CURRENCY_WORDS_SUFFIX = {
  INR: "Rupees Only",
  USD: "US Dollars Only",
  EUR: "Euros Only",
  GBP: "Pounds Only",
  JPY: "Yen Only",
  AUD: "Australian Dollars Only",
  CAD: "Canadian Dollars Only",
  AED: "Dirhams Only",
  SAR: "Riyals Only",
  SGD: "Singapore Dollars Only"
};

export const CURRENCY_CONFIG = {
  INR: {
    code: "INR",
    symbol: "₹",
    locale: "en-IN",
    majorUnitSingular: "Rupee",
    majorUnitPlural: "Rupees",
    minorUnitSingular: "Paisa",
    minorUnitPlural: "Paise",
    decimals: 2,
    numberingSystem: "indian"
  },
  USD: {
    code: "USD",
    symbol: "$",
    locale: "en-US",
    majorUnitSingular: "Dollar",
    majorUnitPlural: "Dollars",
    minorUnitSingular: "Cent",
    minorUnitPlural: "Cents",
    decimals: 2,
    numberingSystem: "international"
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    locale: "en-IE",
    majorUnitSingular: "Euro",
    majorUnitPlural: "Euros",
    minorUnitSingular: "Cent",
    minorUnitPlural: "Cents",
    decimals: 2,
    numberingSystem: "international"
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    locale: "en-GB",
    majorUnitSingular: "Pound",
    majorUnitPlural: "Pounds",
    minorUnitSingular: "Penny",
    minorUnitPlural: "Pence",
    decimals: 2,
    numberingSystem: "international"
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    locale: "ja-JP",
    majorUnitSingular: "Yen",
    majorUnitPlural: "Yen",
    minorUnitSingular: "",
    minorUnitPlural: "",
    decimals: 0,
    numberingSystem: "international"
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    locale: "en-AU",
    majorUnitSingular: "Australian Dollar",
    majorUnitPlural: "Australian Dollars",
    minorUnitSingular: "Cent",
    minorUnitPlural: "Cents",
    decimals: 2,
    numberingSystem: "international"
  },
  CAD: {
    code: "CAD",
    symbol: "C$",
    locale: "en-CA",
    majorUnitSingular: "Canadian Dollar",
    majorUnitPlural: "Canadian Dollars",
    minorUnitSingular: "Cent",
    minorUnitPlural: "Cents",
    decimals: 2,
    numberingSystem: "international"
  },
  AED: {
    code: "AED",
    symbol: "د.إ",
    locale: "en-AE",
    majorUnitSingular: "Dirham",
    majorUnitPlural: "Dirhams",
    minorUnitSingular: "Fils",
    minorUnitPlural: "Fils",
    decimals: 2,
    numberingSystem: "international"
  },
  SAR: {
    code: "SAR",
    symbol: "﷼",
    locale: "en-SA",
    majorUnitSingular: "Riyal",
    majorUnitPlural: "Riyals",
    minorUnitSingular: "Halala",
    minorUnitPlural: "Halalas",
    decimals: 2,
    numberingSystem: "international"
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    locale: "en-SG",
    majorUnitSingular: "Singapore Dollar",
    majorUnitPlural: "Singapore Dollars",
    minorUnitSingular: "Cent",
    minorUnitPlural: "Cents",
    decimals: 2,
    numberingSystem: "international"
  }
};

