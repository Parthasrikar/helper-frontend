import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-helper',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './helper.component.html',
  styleUrl: './helper.component.scss'
})
export class HelperComponent {

}
