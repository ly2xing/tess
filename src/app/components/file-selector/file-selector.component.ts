import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getTimestamp } from '../../../helpers/timestamp';
import { eventJsonTimestampFormat, fileNameTimeStampFormat } from '../../constants';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.sass']
})
export class FileSelectorComponent {

  @Input()
  public files: string[];

  @Input()
  public timestamp: any;

  @Input()
  public current: string;

  @Output()
  public change: EventEmitter<string> = new EventEmitter();

  public onClick(file: string) {
    this.change.emit(file);
  }

  public doesFileContainEvent(file, nextFile, timestamp) {
    const fileTimestamp = getTimestamp(file, fileNameTimeStampFormat);
    const nextFileTimestamp = getTimestamp(nextFile, fileNameTimeStampFormat);
    const parsedTimestamp = getTimestamp(timestamp, eventJsonTimestampFormat);
    return parsedTimestamp.isBetween(fileTimestamp, nextFileTimestamp);
  }
}


