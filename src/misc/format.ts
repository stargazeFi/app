export const formatAPY = (value: number) => `${value * 100}%`

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value)

export const shortenAddress = (address: string, length: number = 4) =>
  `${address.slice(0, length + 2)}...${address.slice(-length)}`
