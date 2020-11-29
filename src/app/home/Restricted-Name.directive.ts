import {AbstractControl, ValidatorFn} from '@angular/forms';

export function NameValidator(users): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    for (let i = 0; i < users.length; i++) {
      if (control.value.trim() === users[i].name){
        return {'NameNotAllowed': true};
      }
    };
    return null;
  }
}

export function EmailValidator(users): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    for (let i = 0; i < users.length; i++) {
      if (control.value.trim().toUpperCase() === users[i].email.toUpperCase()){
        return {'EmailNotAllowed': true};
      }
    };
    return null;
  }
}