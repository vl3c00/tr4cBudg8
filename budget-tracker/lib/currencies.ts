export const Currencies = [
    {value: "USD", label: "$ Dollar", locate:"en-US"},
    {value: "EUR", label: "$ Euro", locate:"en-DE"},
    {value: "JPY", label: "$ Yen", locate:"en-JP"},
    {value: "GBP", label: "$ Pound", locate:"en-GB"},
];

export type Currency = (typeof Currencies)[0];