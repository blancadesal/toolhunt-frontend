export const toHumanReadable = (str: string): string => {
  if (str.includes('::')) {
    return str.split('::').map(part => toHumanReadable(part)).join(' - ')
  }
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleString(undefined, options)
}
