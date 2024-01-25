export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const formatToDecimal = (amount: string | undefined, decimals: number = 2) =>
  !amount
    ? '0'
    : Number(amount)
        .toFixed(decimals)
        .replace(/\.?0+$/, '')

export const formatCurrency = (value: number | bigint | string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(typeof value === 'string' ? Number(value) : value)

export const formatTokenPrice = (value: number | bigint) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)

export const formatEpochToDate = (epoch: number | string): string =>
  new Date(Number(epoch)).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

export const formatEpochToShortDate = (epoch: number | string): string =>
  new Date(Number(epoch)).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

export const formatFee = (value: number, decimals: number = 4) =>
  `${(value / 100).toFixed(decimals).replace(/\.?0+$/, '')}%`

export const formatPercentage = (value: number, decimals: number = 4) =>
  `${(value * 100).toFixed(decimals).replace(/\.?0+$/, '')}%`

export const shortenAddress = (address: string, length: number = 4) =>
  `${address.slice(0, length + 2)}...${address.slice(-length)}`

export const shortenTxHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`
