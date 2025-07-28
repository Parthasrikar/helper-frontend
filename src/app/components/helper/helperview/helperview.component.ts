import { Component, signal, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { HelperService } from '../../../service/helper.service';
import { Helper } from '../../../model/helper.model';
import { Observable } from 'rxjs';
import { CommonModule, NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-helperview',
  standalone: true,
  imports: [MatIconModule, RouterLink, NgClass, CommonModule],
  templateUrl: './helperview.component.html',
  styleUrl: './helperview.component.scss'
})
export class HelperviewComponent {
  constructor(private helperservice: HelperService) { }

  helpersList: Helper[] = [];
  issort = false;
  initalActive: number = 0;
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

  deleteHelper(id: string) : void {
    console.log("deleting");
    
    this.helperservice.deleteHelper(id).subscribe({
      next: (data: Helper) => {
        this.loading.set(true);
        this.singleHelper = data;
        console.log('Fetched single helper:', data);
        this.fetchHelpers();
        this.initalActive = 0;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching helper by ID:', err);
      }
    });
  }

  showsortoptions() {

  }
}
