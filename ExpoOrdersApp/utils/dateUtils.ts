import { format, parseISO } from 'date-fns';

export function formatCreatedDate(dateString?: string | Date): string {
  if (!dateString) return 'Date not available';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const gmt1Time = new Date(utcDate.getTime() + 60 * 60 * 1000);
    return format(gmt1Time, "yyyy-MM-dd HH:mm:ss 'GMT+1'");
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

