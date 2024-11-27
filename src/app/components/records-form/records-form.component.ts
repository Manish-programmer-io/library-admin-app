import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { title } from 'process';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { MatSnakBarService } from '../../services/mat-snak-bar.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-records-form',
  standalone: false,

  templateUrl: './records-form.component.html',
  styleUrl: './records-form.component.scss'
})
export class RecordsFormComponent implements OnInit {

  editingRecordId: number | null = null; // Null means it's a new record

  
  recordForm: FormGroup;
  isEditMode: boolean = false;
  recordId!: number;
  minDate = new Date();
  
  @Input() selectedStudent: any[] = []; // Your student data array
  selectStudent: any = null;
  selectedTabIndex: number = 0;


  constructor(private fb: FormBuilder, private studentService: StudentService,private http: HttpClient, private router: Router, private recordService: RecordService, private route: ActivatedRoute, private _snackBar: MatSnakBarService, ) {
    this.recordForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(15)]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [''],
      book: ['', Validators.required],
      borrowDate: ['', Validators.required],
      returnDate: [{value:'', disabled: true }, Validators.required],
      books: this.fb.array([])
    },
    );

     // Enable the returnDate field when borrowDate is set
     this.recordForm.get('borrowDate')?.valueChanges.subscribe((borrowDate) => {
      const returnDateControl = this.recordForm.get('returnDate');

      if (borrowDate) {
        returnDateControl?.enable();

        // Validate the return date against the borrow date
        const returnDate = returnDateControl?.value;
        if (returnDate && new Date(borrowDate) > new Date(returnDate)) {
          this._snackBar.openConfirmationSnackBar(
            'Borrow Date cannot be later than Return Date!',
            'Close'
          );
          returnDateControl?.setErrors({ invalidDate: true });
        }
      } else {
        returnDateControl?.disable();
        returnDateControl?.reset(); // Reset return date when borrow date is cleared
      }
    });

    // Validate the return date when it changes
    this.recordForm.get('returnDate')?.valueChanges.subscribe((returnDate) => {
      const borrowDate = this.recordForm.get('borrowDate')?.value;
      if (borrowDate && returnDate && new Date(borrowDate) > new Date(returnDate)) {
        this._snackBar.openConfirmationSnackBar(
          'Borrow Date cannot be later than Return Date!',
          'Close'
        );
        this.recordForm.get('returnDate')?.setErrors({ invalidDate: true });
      }
    });
  } 

  onEditStudent(student: string): void {
    console.log('Student', student);
    this.selectedStudent = this.selectStudent; // Set the selected student for editing
  }
  
  // ngOnInit(): void {
  //   // Subscribe to student data from the service
  //   this.studentService.studentData$.subscribe((student) => {
  //     if (student) {
  //       console.log('Editing Student Data:', student);
  //       this.recordForm.patchValue(student); // Populate the form with student data
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.studentService.studentData$.subscribe((student) => {
      if (student) {
        this.editingRecordId = student.id; // Set the ID of the record being edited
        this.recordForm.patchValue(student); // Populate the form
      }
    });
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
  }

  // Remove a book from the list
  removeBook(index: number): void {
    this.books.removeAt(index);
  }

  // Submit form data
  // onSubmit(): void {
  //   if (this.recordForm.valid) {
  //     const FormData = this.recordForm.value;

  //     // Post request to add a new record
  //     this.http.post('http://localhost:3000/students', FormData).subscribe(() => {
  //       this._snackBar.openSnackBar('User Added Successfully!', 'Done');
  //       this.selectedTabIndex = 1;
  //       this.recordForm.reset();
  //       this.books.clear();
  //     });
  //   }
  //   else {
  //     this._snackBar.openSnackBar('Please fill all the required form carefully');
  //   }
  // }

  clearForm() {
    this.recordForm.reset(); // Clear form fields
    this.editingRecordId = null; // Reset to add mode
  }

  onSubmit(studentData: any): void {
    if (studentData.id) {
      const id = studentData.id;
      const updatedData = { ...studentData };
      delete updatedData.id; // Remove `id` from the payload
  
      // Update existing student
      this.studentService.updateStudent(id, updatedData).subscribe(() => {
        this._snackBar.openSnackBar('Student updated successfully!', 'Close');
        this.clearForm(); // Reload the table data
        this.selectStudent = null; // Clear selected student
        this.selectedTabIndex = 0; // Navigate to the table tab
      });
    } else {
      // Add a new student
      this.studentService.addStudent(studentData).subscribe(() => {
        this._snackBar.openSnackBar('Student added successfully!', 'Close');
        this.clearForm(); // Reload the table data
        this.selectedTabIndex = 0; // Navigate to the table tab
      });
    }
  }
}
