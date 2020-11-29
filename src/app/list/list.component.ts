import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  users: Object;

  constructor(private _http: HttpService) { }

  ngOnInit(): void {
    this._http.getUser().subscribe(res => {
      this.users = res;
      console.log(this.users);
    });
  }

}
