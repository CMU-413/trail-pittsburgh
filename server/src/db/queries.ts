import pool from '../db/db'
import { Request, Response } from 'express';

export const getItems = async (req: Request, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM trails');  
      res.status(200).json(result.rows);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).send('Server Error')
        } else {
            console.error('An unknown error has occurred');
            res.status(500).send('Unknown server error');

        }
    }
  };