// import pool from '../db/db'
import { Request, Response } from 'express';
import prisma from '../prismaClient.js';

export const getTrails = async (req: Request, res: Response) => {
    try {
        const trails = await prisma.trails.findMany();
        res.status(200).json(trails)
    } catch(err: unknown) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).json({ error: "Server Error"});
        } else {
            console.error('An unknown error has occurred');
            res.status(500).send('Unknown server error');
        }
        
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};


