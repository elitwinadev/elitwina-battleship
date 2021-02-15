import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const {CLIENT_URL, APP_SECRET, TOKEN_EXPIRATION} = process.env;


export default router;