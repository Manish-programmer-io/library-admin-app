import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnakBarService } from '../../services/mat-snak-bar.service';
import { StudentService } from '../../services/student.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';


@Component({
  selector: 'app-records-table',
  standalone: false, 
  templateUrl: './records-table.component.html',
  styleUrl: './records-table.component.scss'
})

export class RecordsTableComponent implements OnInit {

  displayedColumns: string[] = ['name', 'contact', 'address', 'book', 'actions'];
  students = new MatTableDataSource<string>([]);
  @Input() records: any[] = [];
  selectedTabIndex = 0; //Default the index
  @Output() editStudent = new EventEmitter<any>();
  @Output()  deleteStudent = new EventEmitter<number>(); 
 

  // paginator and sort
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;



  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router, private _snackBar: MatSnakBarService, private studentservice: StudentService ){}

  ngOnInit(): void {
    this.updateTable();
  }

  updateTable(): void{
    this.students.data = this.records;
  }

  // onEdit(student:any): void{
  //   console.log('List', student);
  //   this._snackBar.openSnackBar('Edit Functionality will be implemented in record form', 'Done');
  //   this.editStudent.emit(student);
  // }

  onEdit(student: any): void {
    console.log('Editing Student:', student);
    this.editStudent.emit(student);
    this.studentservice.setStudentData(student); // Send data to the shared service
    this.selectedTabIndex = 1; // Switch to the form tab
  }

  onDelete(studentId:number): void{
    this.deleteStudent.emit(studentId);
  }
  

}
