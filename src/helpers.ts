export function downloadFile(file: string, fileName: string) {
  let link = document.createElement('a');
  link.href = file;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function addDays(date: Date, days: number): Date {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  var result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function getLastDateOfMonth(date: Date): Date {
  var result = new Date(date);
  result.setDate(1);
  result = addMonths(result, 1);
  result = addDays(result, -1);
  return result;
}

export function getFirstDateOfMonth(date: Date): Date {
  var result = new Date(date);
  result.setDate(1);
  return result;
}

export function getMonthName(date: Date): string {
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format;
  return monthName(date);
}
