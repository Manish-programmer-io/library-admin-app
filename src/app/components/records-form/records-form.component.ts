import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { title } from 'process';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { MatSnakBarService } from '../../services/mat-snak-bar.service';

@Component({
  selector: 'app-records-form',
  standalone: false,

  templateUrl: './records-form.component.html',
  styleUrl: './records-form.component.scss'
})
export class RecordsFormComponent implements OnInit {


  recordForm: FormGroup;
  isEditMode!: false;
  recordId!: number;
  minDate = new Date();

  
  @Input() selectStudent: any[] = []; // Your student data array
  selectedStudent: any = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private recordService: RecordService, private route: ActivatedRoute, private _snackBar: MatSnakBarService, ) {
    this.recordForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(15)]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [''],
      borrowDate: ['', Validators.required],
      returnDate: ['', Validators.required],
      books: this.fb.array([])
    },
    );
  }

  onEditStudent(student: any): void {
    this.selectedStudent = this.selectStudent; // Set the selected student for editing
  }

  ngOnInit(): void {
    const recordId = this.route.snapshot.paramMap.get('id');
    if (recordId) {
      this.isEditMode = false;
      this.recordId = Number(recordId);
      this.loadRecord(this.recordId);
    }
  }

  loadRecord(recordId: number): void {
    this.recordService.getRecordById(recordId).subscribe((record) => {
      this.recordForm.patchValue(record);
      const booksArray = this.recordForm.get('books') as FormArray;
      booksArray.clear();
      record.books.forEach((book: string) => booksArray.push(this.fb.control(book)));
    });
  }

  // Getter for books from form array
  get books(): FormArray {
    return this.recordForm.get('books') as FormArray;
  }

  // Add new book to the list
  addBook(): void {
    const bookGroup = this.fb.group({
      title: ['', Validators.required]
    });
    this.books.push(bookGroup);
    // (this.recordForm.get('books') as FormArray).push(this.fb.control(''));
  }

  // Remove a book from the list
  removeBook(index: number): void {
    this.books.removeAt(index);
    // (this.recordForm.get('books') as FormArray).removeAt(index);
  }

  // Submit form data
  onSubmit(): void {
    if (this.recordForm.valid) {
      const FormData = this.recordForm.value;

      // Post request to add a new record
      this.http.post('http://localhost:3000/students', FormData).subscribe(() => {
        this._snackBar.openSnackBar('User Added Successfully!', 'Done');
        
        this.recordForm.reset();
        this.books.clear();
      });
    }
    else {
      this._snackBar.openSnackBar('Please fill all the required form carefully');
    }
  }
}
