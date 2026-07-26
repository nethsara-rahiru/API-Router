const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'app.log');

const formatMessage = (level, message) => {
  return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n`;
};

const writeLog = (level, message) => {
  const formattedMessage = formatMessage(level, message);
  fs.appendFileSync(logFile, formattedMessage);
  console.log(formattedMessage.trim());
};

module.exports = {
  info: (message) => writeLog('info', message),
  error: (message) => writeLog('error', message),
  warn: (message) => writeLog('warn', message),
  debug: (message) => writeLog('debug', message),
};
