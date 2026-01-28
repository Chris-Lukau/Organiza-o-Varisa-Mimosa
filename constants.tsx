
import React from 'react';
import { Category, Product } from './types';

/**
 * MOCK_PRODUCTS inicializado como vazio conforme solicitação do usuário.
 * O catálogo será populado exclusivamente via Painel Administrativo.
 */
export const MOCK_PRODUCTS: Product[] = [];

export const CATEGORIES = Object.values(Category);

export const APP_THEME = {
  primary: 'blue-700',
  secondary: 'gray-900',
  accent: 'red-600'
};
