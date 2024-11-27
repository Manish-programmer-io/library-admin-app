import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatSnakBarService } from '../../services/mat-snak-bar.service';
import { HttpClient } from '@angular/common/http';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  providers: [DatePipe],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  students: any[] = []; //Hold the lost iof students
  selectStudent: any = null; //Hold the data of student being edited
  selectedTabIndex = 0; //Default the index
  today: Date = new Date(); //For date pipe to show current date

  constructor(private router: Router, private studentService: StudentService, private _snackBar: MatSnakBarService, private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  // Fetch the list of students

  loadStudents(): void {
    this.http.get<any[]>('http://localhost:3000/students').subscribe((data) => {
      this.students = data;
    });
  }

  onEditStudents(student: any): void { 
    // console.log('student data', this.students);
    this.selectStudent = { ...student };
    this.selectedTabIndex = 1;

  }


  onDeleteStudent(studentId: number): void {
    // const snackBarRef = this._snackBar.openConfirmationSnackBar(
    //   `Are you sure you want to delete this student ?`,
    //   'Delete' 
    // );

    // Handle the user clicking the 'Delete' action

    // snackBarRef.onAction().subscribe(() => {
    //   this.http.delete(`http://localhost:3000/students/${studentId}`).subscribe(() => {
    //     this._snackBar.openSnackBar('User Deleted Successfully!', 'Done');
    //   });
    // });
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this._snackBar.openSnackBar('Student Deleted Successfully', 'Close');
        this.http.delete(`http://localhost:3000/students/${studentId}`).subscribe(() => {
        });
      }
    });
  }

  onFormSubmit(studentData: any): void {
    if (studentData.id) {
      const id = studentData.id;
      const updatedData = { ...studentData };
      delete updatedData.id;

      //Update existing student
      this.studentService.updateStudent(id, updatedData).subscribe(() => {
        this._snackBar.openSnackBar('Student updated successfully!', 'Close');
        this.loadStudents();
        this.selectStudent = null;
        this.selectedTabIndex = 0;
      });
    }
    else {
      this.studentService.addStudent(studentData).subscribe(() => {
        this._snackBar.openSnackBar('Student added succesfully!', 'close');
        this.loadStudents();
        this.selectedTabIndex = 0;
      });
    }
  }

  onLogout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}

