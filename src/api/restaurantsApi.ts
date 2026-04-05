import { Restaurant } from '../types/types.ts';

const BASE_URL = 'http://10.0.2.2:5083/api';

export const getRestaurants = async (): Promise<Restaurant[]> => {
    const response = await fetch(`${BASE_URL}/restaurants`);
    return response.json();
};