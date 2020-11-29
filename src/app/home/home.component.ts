import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NameValidator, EmailValidator } from './Restricted-Name.directive';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const authToken = 'Bearer 8108efb9729263a70a08c5d7e31e279e5911280bfff6e40bb334192c26005c4b';

interface FormResult {
  code: number;
}

interface UsersResult {
  code: number;
  data: Users;
};

type User = {
  name: string;
  email: string;
  status: string;
}

type Users = User[];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  genders: string[] = ['Male', 'Female'];
  signForm: FormGroup;
  users: Users;
  usersResult: UsersResult;
  result: FormResult;
  active = false;
  submitButtonClicked = false;
  apiResponse: string|number = '';
  submittedSuccesfull = false;

  constructor(private _http: HttpService, private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this._http.getUser().subscribe((result: UsersResult) => {
      this.usersResult = result;
      this.users = this.usersResult.data.filter((user: User) => user.status === 'Active');
      this.initializeForm();
    });
  }

  initializeForm(): void {
    this.signForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), NameValidator(this.users)]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), EmailValidator(this.users)]],
      gender: ['', Validators.required],
      status: 'Active'
    });
  }

  get name() { return this.signForm.get('name') };
  get email() { return this.signForm.get('email') };
  get gender() { return this.signForm.get('gender') };


  selectGender(event): void {
    this.signForm.patchValue({
      gender: event.target.value
    });
  }

  onSubmit() {
    this.submitButtonClicked = true;
    this.apiResponse = '';
    if (this.signForm.status === 'VALID') {
      this.http.post(
        'https://gorest.co.in/public-api/users',
        this.signForm.value,
        {
          headers: new HttpHeaders().set('Authorization', authToken)
        })
        .subscribe(
          (result: FormResult) => {
            this.result = result;
            this.apiResponse = result.code;
            // check if succesfull submit code
            if (this.apiResponse === 201 || this.apiResponse ===200 || this.apiResponse === 204) {
              this.submittedSuccesfull = true;
            } else {
              this.submittedSuccesfull = false;
            }
          },
          (error: any) => {
            this.apiResponse = error.message;
          }
        );
    }
  }
}
