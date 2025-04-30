import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Drink, DrinkCreate } from '../../models/drinks.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

interface DialogData {
  title: string;
  drink: Drink | null;
}

@Component({
  selector: 'app-drink-dialog',
  templateUrl: './drink-dialog.component.html',
  styleUrls: ['./drink-dialog.component.scss'],
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
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DrinkDialogComponent implements OnInit {
  drinkForm!: FormGroup;
  isEditing = false;
  
  sizeOptions = [
    { value: 'S', viewValue: 'Small' },
    { value: 'M', viewValue: 'Medium' },
    { value: 'L', viewValue: 'Large' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DrinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.isEditing = !!this.data.drink;
    
    this.drinkForm = this.fb.group({
      name: [this.data.drink?.name || '', [
        Validators.required, 
        Validators.minLength(1),
        Validators.pattern(/^[a-zA-Z0-9 ]+$/) // Basic protection against special characters
      ]],
      size: [this.data.drink?.size || 'M', [Validators.required]],
      price: [this.data.drink?.price || '', [
        Validators.required, 
        Validators.min(0.01),
        Validators.pattern(/^\d+(\.\d{1,2})?$/) // Allow only valid money format
      ]]
    });
  }

  onSubmit(): void {
    if (this.drinkForm.valid) {
      // Sanitize inputs before submitting
      const sanitizedDrink: DrinkCreate = {
        name: this.sanitizeInput(this.drinkForm.value.name),
        size: this.drinkForm.value.size,
        price: parseFloat(this.drinkForm.value.price)
      };
      
      this.dialogRef.close(sanitizedDrink);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.drinkForm);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Utility function to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private sanitizeInput(input: string): string {
    return input.trim().replace(/[<>&"'`=\/]/g, '');
  }
}