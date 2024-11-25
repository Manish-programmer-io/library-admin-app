import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {


  constructor(private http: HttpClient) { }

  addStudent(student:any): Observable<any>
  {
    return this.http.post<any>('http://localhost:3000/students',student);
    
  }
  updateStudent(id:number , student:any): Observable<any>
  {
    return this.http.put<any>(`http://localhost:3000/students/${id}`,student);
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
