import express from 'express';

export const usuarios = [];

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