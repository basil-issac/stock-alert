import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirm delete</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to delete {{name}}?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="cancel('cancel click')">Cancel</button>
      <button type="button" class="btn btn-outline-dark" (click)="confirm()">Delete</button>
    </div>
  `,
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() name;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  cancel() {
    this.activeModal.close('cancel');
  }

  confirm() {
    this.activeModal.close('confirm')
  }

}
