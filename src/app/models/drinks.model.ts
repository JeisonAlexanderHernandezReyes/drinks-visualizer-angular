export interface Drink {
    id: number;
    name: string;
    size: 'S' | 'M' | 'L';
    price: number;
  }
  
  export interface DrinkCreate {
    name: string;
    size: 'S' | 'M' | 'L';
    price: number;
  }