import express from 'express';
import { execCode } from '../services/sandbox.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Run code safely
router.post('/run',
  body('code').isString().isLength({ min: 1, max: 10000 }),
  body('language').isIn(['javascript', 'python']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, language } = req.body;

    try {
      // Execute code in isolated environment
      const result = await execCode(code, language);
      res.json({ output: result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Validate code syntax
router.post('/validate',
  body('code').isString(),
  body('language').isIn(['javascript', 'python']),
  (req, res) => {
    const { code, language } = req.body;
    
    try {
      if (language === 'javascript') {
        new Function(code);
      } else if (language === 'python') {
        // Basic Python validation (would need more sophisticated parser)
        if (code.includes('import os') || code.includes('import sys')) {
          throw new Error('Unsafe imports not allowed');
        }
      }
      res.json({ valid: true });
    } catch (err) {
      res.status(400).json({ valid: false, error: err.message });
    }
  }
);

export default router;
