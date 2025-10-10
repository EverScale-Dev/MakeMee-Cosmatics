// loggerMiddleware.js
const loggerMiddleware = (req, res, next) => {
    // Get the current time in UTC
    const utcDate = new Date();  
    const formattedIST = utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    });
  
    // Log the request details with the accurate IST timestamp
    console.log(`[${formattedIST}] ${req.method} ${req.originalUrl}`);
    
    next();
  };
  
  module.exports = loggerMiddleware;
  