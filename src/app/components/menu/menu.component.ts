import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrinksService } from '../../services/drinks.service';
import { DrinkDialogComponent } from '../drink-dialog/drink-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Drink } from '../../models/drinks.model';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
  ]
})
export class MenuComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'size', 'price', 'actions'];
  dataSource = new MatTableDataSource<Drink>([]);
  isLoading = true;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private drinksService: DrinksService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadMenu(): void {
    this.isLoading = true;
    this.error = null;
    
    this.drinksService.getMenu().subscribe({
      next: (drinks) => {
        this.dataSource.data = drinks;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error loading menu. Please try again.';
        this.isLoading = false;
        console.error('Error fetching menu:', err);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDrinkDialog(): void {
    const dialogRef = this.dialog.open(DrinkDialogComponent, {
      width: '400px',
      data: { title: 'Add New Drink', drink: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.drinksService.addDrink(result).subscribe({
          next: (newDrink) => {
            this.dataSource.data = [...this.dataSource.data, newDrink];
            this.snackBar.open('Drink added successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          },
          error: (err) => {
            this.snackBar.open('Error adding drink. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            console.error('Error adding drink:', err);
          }
        });
      }
    });
  }

  getDrinkSizeLabel(size: string): string {
    switch(size) {
      case 'S': return 'Small';
      case 'M': return 'Medium';
      case 'L': return 'Large';
      default: return size;
    }
  }
}