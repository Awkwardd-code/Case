// src/validators/option-validator.ts
import { PRODUCT_PRICES } from '@/config/products';

export const COLORS = [
  { label: 'Black', value: 'black', tw: 'zinc-900' },
  { label: 'Blue', value: 'blue', tw: 'blue-950' },
  { label: 'Rose', value: 'rose', tw: 'rose-950' },
] as const;

export const MODELS = {
  name: 'models',
  options: [
    { label: 'iPhone X', value: 'iphonex' },
    { label: 'iPhone 11', value: 'iphone11' },
    { label: 'iPhone 12', value: 'iphone12' },
    { label: 'iPhone 13', value: 'iphone13' },
    { label: 'iPhone 14', value: 'iphone14' },
    { label: 'iPhone 15', value: 'iphone15' },
  ],
} as const;

export const MATERIALS = {
  name: 'material',
  options: [
    {
      label: 'Silicone',
      value: 'silicone',
      description: undefined,
      price: PRODUCT_PRICES.material.silicone,
    },
    {
      label: 'Soft Polycarbonate',
      value: 'polycarbonate',
      description: 'Scratch-resistant coating',
      price: PRODUCT_PRICES.material.polycarbonate,
    },
  ],
} as const;

export const FINISHES = {
  name: 'finish',
  options: [
    {
      label: 'Smooth Finish',
      value: 'smooth',
      description: undefined,
      price: PRODUCT_PRICES.finish.smooth,
    },
    {
      label: 'Textured Finish',
      value: 'textured',
      description: 'Soft grippy texture',
      price: PRODUCT_PRICES.finish.textured,
    },
  ],
} as const;

export const getOptionLabel = (type: 'color' | 'material' | 'finish' | 'model', value?: string) => {
  if (!value) {
    console.warn(`No value provided for ${type}`);
    return type === 'color' ? 'zinc-900' : 'Unknown';
  }

  console.log(`Searching ${type} for value: ${value}`);
  // Use Readonly to allow readonly arrays
  let options: ReadonlyArray<{ label: string; value: string; tw?: string; description?: string; price?: number }> = [];

  switch (type) {
    case 'color':
      options = COLORS;
      break;
    case 'material':
      options = MATERIALS.options;
      break;
    case 'finish':
      options = FINISHES.options;
      break;
    case 'model':
      options = MODELS.options;
      break;
    default:
      console.warn(`Invalid option type: ${type}`);
      return type === 'color' ? 'zinc-900' : 'Unknown';
  }

  const option = options.find((opt) => opt.value === value);
  if (!option) {
    console.warn(`No ${type} option found for value: ${value}`);
    return type === 'color' ? 'zinc-900' : 'Unknown';
  }
  return type === 'color' ? option.tw || 'zinc-900' : option.label;
};