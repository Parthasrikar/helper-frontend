import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxLoadingBar } from "@ngx-loading-bar/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxLoadingBar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'helper-assignment-frontend';
}
