/**
 * Formats a numeric value into Indian Rupee currency format
 * Example: formatCurrency(250) => "₹250.00"
 *          formatCurrency(1250) => "₹1,250.00"
 */
export const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0
  return `₹${numericAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Formats a date string into "DD MMM YYYY" format
 * Example: formatDate("2026-09-01") => "01 Sep 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Formats a time string into 12-hour AM/PM format
 * Example: formatTime("13:45:00") => "01:45 PM"
 */
export const formatTime = (timeString) => {
  if (!timeString) return 'N/A'
  const [hours, minutes] = timeString.split(':')
  if (hours === undefined || minutes === undefined) return timeString

  const hourNum = parseInt(hours, 10)
  const ampm = hourNum >= 12 ? 'PM' : 'AM'
  const formattedHour = hourNum % 12 || 12
  const formattedMinute = minutes.padStart(2, '0')

  return `${String(formattedHour).padStart(2, '0')}:${formattedMinute} ${ampm}`
}

/**
 * Formats a full ISO datetime string into "DD MMM YYYY, hh:mm AM/PM"
 * Example: formatDateTime("2026-09-01T13:45:00") => "01 Sep 2026, 01:45 PM"
 */
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A'
  const date = new Date(dateTimeString)
  if (isNaN(date.getTime())) return dateTimeString

  const formattedDate = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const formattedTime = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return `${formattedDate}, ${formattedTime}`
}
