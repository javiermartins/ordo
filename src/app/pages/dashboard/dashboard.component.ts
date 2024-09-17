import { Component, Input } from '@angular/core';
import { TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [TuiCardLarge, TuiHeader, TuiSurface, TuiTitle],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

    constructor(
        private authService: AuthService
    ) { }

    async ngOnInit() {
        await this.authService.checkAndCreateUser();
    }

}
