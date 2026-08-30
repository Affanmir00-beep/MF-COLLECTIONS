const sanitizeHtml = require('sanitize-html');

// Middleware to sanitize specific text fields (e.g., description, careInstructions) from XSS
const sanitizeXSS = (fields) => (req, res, next) => {
  if (!req.body) return next();

  fields.forEach(field => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      req.body[field] = sanitizeHtml(req.body[field]);
    } else if (req.body[field] && Array.isArray(req.body[field])) {
      req.body[field] = req.body[field].map(item => 
        typeof item === 'string' ? sanitizeHtml(item) : item
      );
    }
  });

  next();
};

module.exports = sanitizeXSS;
