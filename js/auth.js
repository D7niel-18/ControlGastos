import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();
export const usuarios = [
    {
    id: 1,
    nombre: 'Daniel',
    email: 'daniel@gmail.com',
    password: 'prueba' 
    },
];

export function validarRegistro(nombre, email, password, confirmarPassword) {
    if (!nombre || !email || !password || !confirmarPassword) {
        return false;
    }

    const nombreLimpio = nombre.trim();

    if (nombreLimpio.length < 2) {
        return false;
    }

    if (password.length < 8) {
        return false;
    }

    if (confirmarPassword !== password) {
        return false;
    }

    return true;
}