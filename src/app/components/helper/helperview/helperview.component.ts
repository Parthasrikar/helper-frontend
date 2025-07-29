import { Component, signal, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { HelperService } from '../../../service/helper.service';
import { Helper } from '../../../model/helper.model';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, NgModel } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog.component'; // adjust path
import { TemplateRef, ViewChild } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewContainerRef } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';





@Component({
  selector: 'app-helperview',
  standalone: true,
  imports: [MatIconModule, RouterLink, NgClass, CommonModule, MatSnackBarModule, FormsModule, MatMenuModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatDialogModule, OverlayModule,   // 👈 Needed for overlay
    PortalModule],
  templateUrl: './helperview.component.html',
  styleUrl: './helperview.component.scss'
})
export class HelperviewComponent {

  @ViewChild('filterTemplate') filterTemplate!: TemplateRef<any>; 
  private overlayRef?: OverlayRef;

  constructor(private helperservice: HelperService, public router: Router, private snackBar: MatSnackBar, private dialog: MatDialog, private overlay: Overlay,
    private vcr: ViewContainerRef) { }

  helpersList: Helper[] = [];
  noOfHelpers = 0
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

  selectedService = '';
  selectedOrganization = '';
  allHelpers: Helper[] = []; // keep a copy of full list

  get uniqueServices() {
    return [...new Set(this.allHelpers.map(h => h.typeOfService))];
  }

  get uniqueOrganizations() {
    return [...new Set(this.allHelpers.map(h => h.organization))];
  }

  applyFilters() {
    this.helpersList = this.allHelpers.filter(helper => {
      const serviceMatch = !this.selectedService || helper.typeOfService === this.selectedService;
      const orgMatch = !this.selectedOrganization || helper.organization === this.selectedOrganization;
      return serviceMatch && orgMatch;
    });
  }

  resetFilters() {
    this.selectedService = '';
    this.selectedOrganization = '';
    this.helpersList = [...this.allHelpers];
  }

  fetchHelpers(): void {
    this.helperservice.getAllHelper().subscribe({
      next: (data: Helper[]) => {
        this.allHelpers = [...data];   // Keep original list for filtering
        this.helpersList = [...data];  // Display list
        this.noOfHelpers = data.length;

        const defaultId = this.helpersList[this.initalActive]?._id;
        if (defaultId) {
          this.fetchHelperById(defaultId);
        }
      },
      error: (err) => console.error('Error fetching helpers:', err)
    });
  }





  private searchTimeout: any;

  onSearch(): void {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      const query = this.searchQuery.trim();

      if (!query) {
        // Empty search → fetch all
        this.fetchHelpers();
      } else {
        console.log("searching");

        this.helperservice.getAllHelper(query).subscribe({
          next: (data) => {
            this.helpersList = data;
            console.log(data);
            this.noOfHelpers = data.length

            // Reset detail view
            this.initalActive = 0;
            if (data.length > 0) {
              this.fetchHelperById(data[0]._id);
            } else {
              this.singleHelper = {} as Helper;
            }
          },
          error: (err) => console.error(err)
        });
      }
    }, 300); // Debounce 300ms
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

  deleteHelper(id: string, name: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // User confirmed
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
          error: err => console.error('Error deleting helper:', err)
        });
      }
    });
  }



  editHelper(): void {
    this.router.navigate(
      ['/dashboard/helpers/addhelper'],
      { state: { helperData: this.singleHelper } }
    );
  }


  sortHelpers(field: string) {
    if (field === 'name') {
      this.helpersList.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (field === 'employeeId') {
      this.helpersList.sort((a, b) => {
        return (Number(a.employeeId) || 0) - (Number(b.employeeId) || 0);
      });
    }
  }

  openFilterOverlay(event: Event) {
  const trigger = event.currentTarget as HTMLElement;
  if (!trigger) return;

  if (this.overlayRef?.hasAttached()) {
    this.closeFilterOverlay();
    return;
  }

  const positionStrategy = this.overlay.position()
    .flexibleConnectedTo(trigger)
    .withPositions([
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top'
      }
    ]);

  this.overlayRef = this.overlay.create({
    positionStrategy,
    hasBackdrop: true,
    backdropClass: 'cdk-overlay-transparent-backdrop',
    scrollStrategy: this.overlay.scrollStrategies.close()
  });

  this.overlayRef.backdropClick().subscribe(() => this.closeFilterOverlay());

  this.overlayRef.attach(new TemplatePortal(this.filterTemplate, this.vcr));
}


  closeFilterOverlay() {
    this.overlayRef?.dispose();
  }





}


