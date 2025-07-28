import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HelperService } from '../../../service/helper.service';
import { CreateHelperDto } from '../../../dto/create-helper.dto';
import { GenderEnum, DocType, VehiclesType, Roles } from '../../../model/helper.model';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-helper',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './addhelper.component.html',
  styleUrls: ['./addhelper.component.scss']
})
export class AddHelperComponent implements OnInit {
  helperForm: FormGroup;
  currentStep = 1;
  totalSteps = 4;
  selectedFile: File | null = null;
  createdHelper: any = null;
  isLoading = false;
  // Enum options for dropdowns
  genderOptions = Object.values(GenderEnum);
  roleOptions = Object.values(Roles);
  vehicleOptions = Object.values(VehiclesType);
  docTypeOptions = Object.values(DocType);
  editMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { helperData?: any };

    if (state?.helperData) {
      this.createdHelper = state.helperData;
      this.editMode = true;
      this.helperForm = this.createForm();
      this.helperForm.patchValue(state.helperData); // Pre-fill
    } else {
      this.helperForm = this.createForm();
    }
  }

  ngOnInit(): void { }

  createForm(): FormGroup {
    return this.fb.group({
      name: [this.createdHelper?.name || '', [Validators.required, Validators.minLength(2)]],
      phone: [this.createdHelper?.phone || '', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      email: [this.createdHelper?.email || '', [Validators.email]],
      gender: [this.createdHelper?.gender || GenderEnum.MALE, Validators.required],
      languages: [this.createdHelper?.languages?.join(', ') || '', Validators.required],
      typeOfService: [this.createdHelper?.typeOfService || Roles.MAID, Validators.required],
      organization: [this.createdHelper?.organization || '', Validators.required],
      type: [this.createdHelper?.type || VehiclesType.NONE, Validators.required],
      status: [this.createdHelper?.status || DocType.ADHAAR, Validators.required],
      employeeId: [this.createdHelper?.employeeId || this.generateEmployeeId(), [Validators.required]]
    });
  }


  // Navigation methods
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.currentStep === 1 && this.helperForm.invalid) {
        this.markFormGroupTouched();
        return;
      }
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    // Only allow navigation to current step or previous completed steps
    if (step <= this.currentStep) {
      this.currentStep = step;
    }
    // Don't allow jumping to future steps
  }

  // File handling
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Form submission
  onSubmit(): void {
    if (this.helperForm.valid) {
      this.isLoading = true;

      const formData = this.helperForm.value;
      const languagesArray = Array.isArray(formData.languages)
        ? formData.languages.map((lang: string) => lang.trim())
        : formData.languages.split(',').map((lang: string) => lang.trim());

      const dto: CreateHelperDto = {
        ...formData,
        languages: languagesArray,
        joinedDate: this.editMode ? this.createdHelper.joinedDate : new Date()
      };

      if (this.editMode) {
        this.helperService.updateHelper(this.createdHelper._id, dto).subscribe({
          next: (response) => {
            this.createdHelper = response;
            this.isLoading = false;

            // ✅ Show toast
            this.snackBar.open('Helper updated successfully!', 'Close', {
              duration: 3000, // 3 seconds
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              panelClass: ['success-snackbar'] // optional custom style
            });

            // Navigate after showing toast
            this.router.navigate(['dashboard/helpers/helperview']);
          },
          error: (error) => {
            console.error('Error updating helper:', error);
            this.isLoading = false;
          }
        });
      }
      else {
        this.helperService.createHelper(dto).subscribe({
          next: (response) => {
            this.createdHelper = response;
            this.isLoading = false;
            this.currentStep = 4;
          },
          error: (error) => {
            console.error('Error creating helper:', error);
            this.isLoading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }



  // Utility methods
  generateEmployeeId(): number {
    // Generate a random employee ID between 10000 and 99999
    return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  }

  markFormGroupTouched(): void {
    Object.keys(this.helperForm.controls).forEach(key => {
      this.helperForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.helperForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Invalid email format';
      if (field.errors['pattern']) return 'Invalid format';
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }

  // Navigation after success
  viewHelper(): void {
    this.router.navigate(['/dashboard/helpers/helperview']);
  }

  addAnotherHelper(): void {
    this.helperForm.reset();
    this.currentStep = 1;
    this.selectedFile = null;
    this.createdHelper = null;
    this.helperForm.patchValue({
      gender: GenderEnum.MALE,
      typeOfService: Roles.MAID,
      type: VehiclesType.NONE,
      status: DocType.ADHAAR,
      employeeId: this.generateEmployeeId()
    });
  }

  // Step validation
  isStepValid(step: number): boolean {
    // Only allow validation for completed steps (steps before current)
    if (step >= this.currentStep) {
      return false;
    }

    switch (step) {
      case 1:
        const requiredFields = ['name', 'phone', 'gender', 'languages', 'typeOfService', 'organization'];
        return requiredFields.every(field => this.helperForm.get(field)?.valid);
      case 2:
        return true; // Document upload is optional
      case 3:
        return this.helperForm.valid;
      default:
        return false;
    }
  }

  getStepClass(step: number): string {
    if (step === this.currentStep) {
      return 'current';
    } else if (step < this.currentStep) {
      return 'completed';
    } else {
      return 'pending';
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'short' });
    const year = today.getFullYear();
    return `${day} ${month} ${year}`;
  }

}