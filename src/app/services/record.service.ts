import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class RecordService {
    private apiUrl = 'http://localhost:3000/records';
  constructor(private http: HttpClient) { }
  getRecords(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getRecordById(recordId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${recordId}`);
  }
  createRecord(record: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, record);
  }
  updateRecord(recordId: number, record: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${recordId}`, record);
  }
} 