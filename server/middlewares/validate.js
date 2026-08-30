const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Express 5 makes req.query, req.params getters, so we cannot reassign them.
    // We will clear and mutate the existing objects instead.
    if (validatedData.body) {
      Object.keys(req.body).forEach(key => delete req.body[key]);
      Object.assign(req.body, validatedData.body);
    }
    if (validatedData.query) {
      Object.keys(req.query).forEach(key => delete req.query[key]);
      Object.assign(req.query, validatedData.query);
    }
    if (validatedData.params) {
      Object.keys(req.params).forEach(key => delete req.params[key]);
      Object.assign(req.params, validatedData.params);
    }
    
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: (err.issues || err.errors).map(e => ({ path: e.path.join('.'), message: e.message }))
      });
    }
    next(err);
  }
};

module.exports = validate;
