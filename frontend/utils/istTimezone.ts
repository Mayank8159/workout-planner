/**
 * IST (Indian Standard Time) timezone utilities
 * IST is UTC+5:30
 */

// IST offset in milliseconds (5 hours 30 minutes = 19800000 ms)
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/**
 * Get current date and time in IST
 * @returns Date object representing current IST time
 */
export function getISTNow(): Date {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcTime + IST_OFFSET_MS);
}

/**
 * Convert any Date to IST
 * @param date - Date to convert (can be any timezone)
 * @returns Date object in IST
 */
export function toIST(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  const utcTime = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utcTime + IST_OFFSET_MS);
}

/**
 * Format date in IST timezone
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string in IST
 */
export function formatISTDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', options).format(d);
}

/**
 * Get date string in YYYY-MM-DD format for IST
 * @param date - Date to format (defaults to current IST time)
 * @returns Date string in YYYY-MM-DD format
 */
export function getISTDateString(date?: Date | string): string {
  const istDate = date ? toIST(date) : getISTNow();
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const day = String(istDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time ago in IST context
 * @param dateString - ISO date string
 * @returns Human-readable time ago string
 */
export function getISTTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = getISTNow();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return formatISTDate(date, {
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Kolkata',
    });
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * Format date to local IST format (DD/MM/YYYY)
 * @param date - Date to format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatISTLocalDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatISTDate(d, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

/**
 * Get IST time in HH:MM format
 * @param date - Date to format (defaults to current IST time)
 * @returns Time string in HH:MM format
 */
export function getISTTimeString(date?: Date | string): string {
  const istDate = date ? toIST(date) : getISTNow();
  return formatISTDate(istDate, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });
}

/**
 * Check if date is today in IST timezone
 * @param date - Date to check
 * @returns true if date is today in IST
 */
export function isISTToday(date: Date | string): boolean {
  const checkDate = getISTDateString(date);
  const today = getISTDateString();
  return checkDate === today;
}
