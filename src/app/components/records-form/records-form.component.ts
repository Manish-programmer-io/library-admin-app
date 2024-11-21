import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { title } from 'process';

@Component({
  selector: 'app-records-form',
  standalone: false,

  templateUrl: './records-form.component.html',
  styleUrl: './records-form.component.scss'
})
export class RecordsFormComponent implements OnInit {

  recordForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.recordForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(15)]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [''],
      borrowDate: ['', Validators.required],
      returnDate: ['', Validators.required],
      books: this.fb.array([])
    });
  }

  ngOnInit(): void {
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
  }

  // Remove a book from the list
  removeBook(index: number): void {
    this.books.removeAt(index);
  }

  // Submit form data
  onSubmit(): void {
    if (this.recordForm.valid) {
      const FormData = this.recordForm.value;

      // Post request to add a new record
      this.http.post('http://localhost:3000/students', FormData).subscribe(() => {
        alert('Record Saves Successfully!');
        this.recordForm.reset();
        this.books.clear();
      });
    }
    else{
      alert('Please fill all the required fields correctly')
    }
  }
}
