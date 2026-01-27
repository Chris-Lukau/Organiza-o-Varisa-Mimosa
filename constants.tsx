
import React from 'react';
import { Category, Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Kit de Distribuição - VW Golf VII',
    description: 'Kit completo de correia de distribuição original para motores 1.6/2.0 TDI.',
    price: 85000,
    category: Category.MOTOR,
    brand: 'Continental',
    stock: 12,
    imageUrl: 'https://picsum.photos/seed/parts1/400/300'
  },
  {
    id: '2',
    name: 'Discos de Travão Dianteiros - BMW Série 3',
    description: 'Par de discos ventilados de alta performance para modelos E90/F30.',
    price: 45000,
    category: Category.TRAVOES,
    brand: 'Brembo',
    stock: 8,
    imageUrl: 'https://picsum.photos/seed/parts2/400/300'
  },
  {
    id: '3',
    name: 'Amortecedores Traseiros - Toyota Hilux',
    description: 'Par de amortecedores a gás reforçados para condições de carga pesada.',
    price: 120000,
    category: Category.SUSPENSAO,
    brand: 'KYB',
    stock: 5,
    imageUrl: 'https://picsum.photos/seed/parts3/400/300'
  },
  {
    id: '4',
    name: 'Farol LED Dianteiro - Mercedes C-Class',
    description: 'Ótica completa Full LED com design adaptativo.',
    price: 250000,
    category: Category.ILUMINACAO,
    brand: 'Hella',
    stock: 2,
    imageUrl: 'https://picsum.photos/seed/parts4/400/300'
  }
];

export const CATEGORIES = Object.values(Category);

export const APP_THEME = {
  primary: 'blue-700',
  secondary: 'gray-900',
  accent: 'red-600'
};
