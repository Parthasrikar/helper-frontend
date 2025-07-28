import { Component, signal, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { HelperService } from '../../../service/helper.service';
import { Helper } from '../../../model/helper.model';
import { Observable } from 'rxjs';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, NgModel } from '@angular/forms';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-helperview',
  standalone: true,
  imports: [MatIconModule, RouterLink, NgClass, CommonModule, MatSnackBarModule, FormsModule],
  templateUrl: './helperview.component.html',
  styleUrl: './helperview.component.scss'
})
export class HelperviewComponent {
  constructor(private helperservice: HelperService, public router : Router, private snackBar: MatSnackBar ) { }

  helpersList: Helper[] = [];
  issort = false;
  initalActive: number = 0;
  searchQuery = '';
  profileColors: string[] = [
    '#4A90E2', // Soft Blue
    '#7ED321', // Fresh Green
    '#F5A623', // Sunset Orange
    '#D0021B', // Coral Red
    '#9013FE', // Royal Purple
    '#50E3C2', // Sky Teal
    '#9B9B9B', // Warm Gray
    '#34495E', // Indigo Blue
    '#F8E71C', // Lemon Yellow
    '#FF6F91'  // Cool Pink
  ];

  singleHelper: Helper = this.helpersList[0];
  loading = signal(true);

  ngOnInit() {
    this.fetchHelpers();
  }

private searchTimeout: any;

onSearch(): void {
  clearTimeout(this.searchTimeout);
  
  this.searchTimeout = setTimeout(() => {
    const query = this.searchQuery.trim();
    
    if (!query) {
      this.fetchHelpers();
    } else {
      this.helperservice.searchHelpers(query).subscribe({
        next: (data: Helper[]) => {
          console.log('🔍 Updating helpersList:', data);
          this.helpersList = [...data]; // force refresh
        }
      });
    }
  }, 300);
}




  fetchHelpers(): void {
    this.helperservice.getAllHelper().subscribe({
      next: (data: Helper[]) => {
        this.helpersList = data;
        console.log('Fetched helpers:', data);

        const defaultId = this.helpersList[this.initalActive]?._id;
        if (defaultId) {
          console.log(defaultId);

          this.fetchHelperById(defaultId);
        }
      },
      error: (err) => {
        console.error('Error fetching helpers:', err);
      }
    });
  }


  fetchHelperById(id: string): void {
    console.log("hello");

    this.helperservice.getHelperById(id).subscribe({

      next: (data: Helper) => {
        this.loading.set(true);
        this.singleHelper = data;
        console.log('Fetched single helper:', data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching helper by ID:', err);
      }
    });
  }

  trackByHelperId(index: number, helper: any) {
    return helper._id; // or just index if no unique ID
  }

  changeinital(idx: number): void {
    this.initalActive = idx;
    const selectedHelper = this.helpersList[idx];
    if (selectedHelper?._id) {
      this.fetchHelperById(selectedHelper._id);
    }
  }

  deleteHelper(id: string): void {
  this.helperservice.deleteHelper(id).subscribe({
    next: () => {
      this.snackBar.open('Helper deleted successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['delete-snackbar']
      });
      this.fetchHelpers();
      this.initalActive = 0;
    },
    error: (err) => {
      console.error('Error deleting helper:', err);
    }
  });
}


  showsortoptions() {

  }

  editHelper(): void {
  this.router.navigate(
    ['/dashboard/helpers/addhelper'],
    { state: { helperData: this.singleHelper } }
  );
}


  
}
