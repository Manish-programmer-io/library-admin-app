import { Component, OnInit, viewChild, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-records-table',
  standalone: false, 
  templateUrl: './records-table.component.html',
  styleUrl: './records-table.component.scss'
})
export class RecordsTableComponent implements OnInit {

  displayedColumns: string[] = ['name', 'contact', 'address', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  // paginator and sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // data: never[] = [];


  constructor(private http: HttpClient, private dialog: MatDialog ){}

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords(): void {
    this.http.get<any[]>('http://localhost:3000/students').subscribe((data)=>{
      console.log('Fetched data:', data);
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
    });
  }

  onEdit(student:any): void{
    alert('Edit Functionality will be implemented in record form')
  }
  
  // new line
  onDelete(student:any): void{
    const confirmDelete = confirm(`Are you sure you want to delete ${student.name}?`);
    if(confirmDelete){
      this.http.delete(`http://localhost:3000/students/${student.id}`).subscribe(() =>{
        alert('Record Deleted Successfully');
        this.fetchRecords();
      });
    }
  }

}
