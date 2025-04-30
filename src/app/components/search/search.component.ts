import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DrinksService } from '../../services/drinks.service';
import { DrinkDialogComponent } from '../drink-dialog/drink-dialog.component';
import { Drink } from '../../models/drinks.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginatorModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  drinks: Drink[] = [];
  isLoading = false;
  error: string | null = null;
  noResults = false;

  constructor(
    private drinksService: DrinksService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.setupSearch();
  }

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 2) {
          this.drinks = [];
          this.noResults = false;
          return of([]);
        }
        
        this.isLoading = true;
        this.error = null;
        this.noResults = false;
        
        // Sanitize input
        const sanitizedTerm = this.sanitizeInput(term);
        
        return this.drinksService.getDrinkByName(sanitizedTerm).pipe(
          catchError(err => {
            // If 404, it's not an error, just no results
            if (err.status === 404) {
              this.noResults = true;
              return of([]);
            }
            
            this.error = 'Error searching for drinks. Please try again.';
            console.error('Search error:', err);
            return of([]);
          })
        );
      })
    ).subscribe(drinks => {
      this.drinks = drinks;
      this.isLoading = false;
      
      // Set noResults flag if search term is valid but no results returned
      if (this.searchControl.value && this.searchControl.value.length >= 2 && drinks.length === 0 && !this.error) {
        this.noResults = true;
      }
    });
  }

  viewDrinkDetails(drink: Drink): void {
    this.dialog.open(DrinkDialogComponent, {
      width: '400px',
      data: { 
        title: 'Drink Details',
        drink: {...drink},
        readonly: true
      }
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.drinks = [];
    this.noResults = false;
    this.error = null;
  }

  // Basic input sanitization
  private sanitizeInput(input: string): string {
    if (!input) return '';
    // Remove any potentially dangerous characters
    return input.trim().replace(/[<>&"'`=\/]/g, '');
  }
}