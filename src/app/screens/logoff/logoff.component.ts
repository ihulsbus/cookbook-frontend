import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-logoff',
  standalone: true,
  templateUrl: './logoff.component.html',
  styleUrls: ['./logoff.component.css']
})
export class LogoffComponent implements OnInit {
  baseURL: string = environment.baseURL

  constructor() {
    // This is intentionally empty
  }

  ngOnInit(): void {
    // This is intentionally empty
  }

}
