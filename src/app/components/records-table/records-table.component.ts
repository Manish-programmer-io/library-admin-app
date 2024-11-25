import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnakBarService } from '../../services/mat-snak-bar.service';
import { StudentService } from '../../services/student.service';


@Component({
  selector: 'app-records-table',
  standalone: false, 
  templateUrl: './records-table.component.html',
  styleUrl: './records-table.component.scss'
})

export class RecordsTableComponent implements OnInit {

  displayedColumns: string[] = ['name', 'contact', 'address', 'actions'];
  students = new MatTableDataSource<any>([]);
  @Input() records: any[] = [];
  @Output() editStudent = new EventEmitter<any>();
  @Output()  deleteStudent = new EventEmitter<number>(); 
 

  // paginator and sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router, private _snackBar: MatSnakBarService, private studentservice: StudentService ){}

  ngOnInit(): void {
    this.updateTable();
  }

  updateTable(): void{
    this.students.data = this.records
  }

  // fetchRecords(): void {
  //   this.http.get<any[]>('http://localhost:3000/students').subscribe((data)=>{
  //     this.dataSource.data = data;
  //     this.dataSource.paginator = this.paginator;
  //     console.log(this.dataSource.data);
  //     this.dataSource.sort = this.sort;
  //   });
    
  // }

  onEdit(student:any): void{
    this._snackBar.openSnackBar('Edit Functionality will be implemented in record form', 'Done');
    this.editStudent.emit(student);
  }

  onDelete(studentId:number): void{
    this.deleteStudent.emit(studentId);

  }
  
  // onDelete(student: any): void {
  //   const snackBarRef = this._snackBar.openConfirmationSnackBar(
  //     `Are you sure you want to delete ${student.name} ?`, 
  //     'Delete' // This is the action argument
    // );
  
    // Handle the user clicking the 'Delete' action
    // snackBarRef.onAction().subscribe(() => {
    //   this.http.delete(`http://localhost:3000/students/${student.id}`).subscribe(() => {
    //     this._snackBar.openSnackBar('User Deleted Successfully!', 'Done');
    //     this.fetchRecords(); // Fetch records again to update the list
  //     });
  //   });
  // }
}
