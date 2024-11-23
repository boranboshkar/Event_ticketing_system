export function formatUTCDateTimeString(utcDateString:string) {
    const date = new Date(utcDateString);
  
    // Extracting and formatting the components
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // getUTCMonth() is zero-based, add 1 to match the common month number
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
    // Constructing the formatted string
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  export function formatUTCTimeString(utcDateString:string) {
    const date = new Date(utcDateString);
  
    // Extracting and formatting the components
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
    // Constructing the formatted string
    return `${hours}:${minutes}`;
  }
  export function formatUTCDateString(utcDateString:string) {
    const date = new Date(utcDateString);
    // Extracting and formatting the components
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // getUTCMonth() is zero-based, add 1 to match the common month number
    const day = date.getUTCDate().toString().padStart(2, '0');
    // Constructing the formatted string
    return `${year}-${month}-${day}`;
  }

  // Helper function to format date to "YYYY-MM-DDTHH:mm"
export function formatLocalDateTime(dateString:string) {
  const date = new Date(dateString);
  const isoDate = date.toISOString();
  return isoDate.substring(0, 16); // Returns "YYYY-MM-DDTHH:mm"
}