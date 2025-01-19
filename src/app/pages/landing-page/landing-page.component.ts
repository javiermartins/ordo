import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [TuiIcon, TuiButton, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
