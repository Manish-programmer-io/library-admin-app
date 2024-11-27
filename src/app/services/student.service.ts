import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
 
  private studentData = new BehaviorSubject<any | null>(null); // Holds the current student record
  private apiUrl = 'http://localhost:3000';

  // Observable to allow components to subscribe to the data
  studentData$: Observable<any> = this.studentData.asObservable();

  // Method to set student data
  setStudentData(data: any): void {
    this.studentData.next(data); // Emit the new student data
  }
  constructor(private http: HttpClient) { }

  addStudent(student:any): Observable<any>
  {
    return this.http.post<any>('http://localhost:3000/students',student);
    
  }
  updateStudent(id: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedData);
  }
  

  deleteStudents(id:number): Observable<any>{
    return this.http.delete<any>(`http://localhost:3000/students/${id}`);
  }
  
  getStudents(): Observable<any[]>
  {
    return this.http.get<any[]>('http://localhost:3000/students');
  }
  removeBook(id:number)
  {
    return this.http.delete(`http://localhost:3000/students/${id}`)
  }
}
