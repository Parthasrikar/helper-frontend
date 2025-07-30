import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Helper } from '../model/helper.model';
import { CreateHelperDto } from '../dto/create-helper.dto';
import { UpdateHelperDto } from '../dto/update-helper.dto';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private http: HttpClient) { }

  private apiUrl = "http://localhost:3000/helper";

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error (${error.status}): ${error.error?.message || error.statusText}`;
    }

    console.error('HTTP Error:', error); 
    return throwError(() => new Error(errorMessage)); 
  }

  // Existing methods (unchanged)
  getAllHelper(search?: string): Observable<Helper[]> {
    const url = search ? `${this.apiUrl}?search=${encodeURIComponent(search)}` : this.apiUrl;
    return this.http.get<Helper[]>(url);
  }

  getHelperById(id: string): Observable<Helper> {
    return this.http.get<Helper>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createHelper(createhelper: CreateHelperDto): Observable<Helper> {
    let header = new HttpHeaders()
      .set("Content-Type", "application/json");
    return this.http.post<Helper>(this.apiUrl, createhelper, { headers: header }).pipe(catchError(this.handleError));
  }

  updateHelper(id: string, updatehelper: UpdateHelperDto) {
    let header = new HttpHeaders()
      .set("Content-Type", "application/json");
    return this.http.patch<Helper>(`${this.apiUrl}/${id}`, updatehelper, { headers: header }).pipe(catchError(this.handleError));
  }

  deleteHelper(id: string): Observable<Helper> {
    return this.http.delete<Helper>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  // ✅ New function for uploading KYC document to S3
  uploadKycDocument(helperId: string, file: File): Observable<Helper> {
    const formData = new FormData();
    formData.append('kycDocument', file);

    return this.http.post<Helper>(`${this.apiUrl}/${helperId}/upload-kyc`, formData)
      .pipe(catchError(this.handleError));
  }
}
