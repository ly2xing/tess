import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.sass']
})
export class FileSelectorComponent {

  @Input()
  public files: string[];

  @Output()
  public change: EventEmitter<string> = new EventEmitter();

  public onClick(file: string) {
    this.change.emit(file);
  }
}


