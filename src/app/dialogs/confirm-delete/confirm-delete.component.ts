import { Component } from '@angular/core';
import { TuiButton, TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

export class Props {
  header: string;
  description: string;
}

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [TuiButton],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss'
})
export class ConfirmDeleteComponent {
  protected readonly context =
    injectContext<TuiDialogContext<boolean, Props>>();

  delete() {
    this.context.completeWith(true);
  }

  cancel() {
    this.context.completeWith(false);
  }
}
