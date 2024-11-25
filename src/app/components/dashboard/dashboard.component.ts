import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatSnakBarService } from '../../services/mat-snak-bar.service';

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

  constructor(private router: Router, private studentService: StudentService, private _snackBar: MatSnakBarService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  // Fetch the list of students

  loadStudents(): void {
    this.studentService.getStudents().subscribe((data) => {
      this.students = data; //populate the student array
    });
  }

  onEditStudents(student: any): void {
    this.selectStudent = { ...student };
    this.selectedTabIndex = 1;

  }


  onDeleteStudent(studentId: number): void {
    if (confirm(`Are you sure you want to delete this student`)) {
      this.studentService.deleteStudents(studentId).subscribe(() => {
        this._snackBar.openSnackBar('User Deleted Successfully!', 'Done');
        this.loadStudents(); //refresh the list after deletion
      });
    }
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

