import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { logger } from '../utils/logger';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request data based on schema
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });

      // Replace request data with validated data
      req.body = validatedData.body || req.body;
      req.query = validatedData.query || req.query;
      req.params = validatedData.params || req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Validation failed', {
          errors: error.errors,
          url: req.url,
          method: req.method
        });

        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      logger.error('Unexpected error in validation middleware', { error });
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation'
      });
    }
  };
};

export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = await schema.parseAsync(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Body validation failed', {
          errors: error.errors,
          url: req.url,
          method: req.method
        });

        return res.status(400).json({
          success: false,
          message: 'Invalid request body',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      logger.error('Unexpected error in body validation middleware', { error });
      return res.status(500).json({
        success: false,
        message: 'Internal server error during body validation'
      });
    }
  };
};

export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = await schema.parseAsync(req.query);
      req.query = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Query validation failed', {
          errors: error.errors,
          url: req.url,
          method: req.method
        });

        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      logger.error('Unexpected error in query validation middleware', { error });
      return res.status(500).json({
        success: false,
        message: 'Internal server error during query validation'
      });
    }
  };
};

export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedParams = await schema.parseAsync(req.params);
      req.params = validatedParams;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Params validation failed', {
          errors: error.errors,
          url: req.url,
          method: req.method
        });

        return res.status(400).json({
          success: false,
          message: 'Invalid URL parameters',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      logger.error('Unexpected error in params validation middleware', { error });
      return res.status(500).json({
        success: false,
        message: 'Internal server error during params validation'
      });
    }
  };
};
