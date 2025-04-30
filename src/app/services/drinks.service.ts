import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Drink, DrinkCreate } from '../models/drinks.model';

@Injectable({
  providedIn: 'root'
})
export class DrinksService {
  private apiUrl = environment.apiUrl; // Uses the environment configuration

  constructor(private http: HttpClient) { }

  /**
   * Get all drinks from the menu
   */
  getMenu(): Observable<Drink[]> {
    return this.http.get<Drink[]>(`${this.apiUrl}/menu`);
  }

  /**
   * Search for drinks by name
   */
  getDrinkByName(name: string): Observable<Drink[]> {
    return this.http.get<Drink[]>(`${this.apiUrl}/menu/${name}`);
  }

  /**
   * Add a new drink to the menu
   */
  addDrink(drink: DrinkCreate): Observable<Drink> {
    return this.http.post<Drink>(`${this.apiUrl}/menu`, drink);
  }
}