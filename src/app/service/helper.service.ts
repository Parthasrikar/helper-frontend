import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, ObservableInput, throwError } from 'rxjs';
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


  getAllHelper(): Observable<Helper[]> {
    return this.http.get<Helper[]>(this.apiUrl).pipe(catchError(this.handleError))
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
    return this.http.patch<Helper>(`${this.apiUrl}/${id}`, updatehelper, {headers : header}).pipe(catchError(this.handleError));
  }

  deleteHelper(id: string): Observable<Helper> {
    return this.http.delete<Helper>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
  searchHelpers(query: string): Observable<Helper[]> {
  return this.http.get<Helper[]>(`${this.apiUrl}?search=${encodeURIComponent(query)}`);
}

}
