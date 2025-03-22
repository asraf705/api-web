export const saveLog = (logData) => {
  try {
    // Get existing logs from localStorage
    const existingLogs = JSON.parse(localStorage.getItem('apiTesterLogs') || '[]');
    
    // Add new log
    const newLogs = [logData, ...existingLogs].slice(0, 100); // Keep last 100 logs
    
    // Save back to localStorage
    localStorage.setItem('apiTesterLogs', JSON.stringify(newLogs));
  } catch (error) {
    console.error('Failed to save log:', error);
  }
};

export const getLogs = () => {
  try {
    return JSON.parse(localStorage.getItem('apiTesterLogs') || '[]');
  } catch (error) {
    console.error('Failed to get logs:', error);
    return [];
  }
};

export const clearLogs = () => {
  try {
    localStorage.removeItem('apiTesterLogs');
  } catch (error) {
    console.error('Failed to clear logs:', error);
  }
};