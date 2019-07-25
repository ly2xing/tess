import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private isPlayingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private timeSubject: Subject<number> = new Subject();
  private completeSubject: Subject<void> = new Subject();

  public get isPlaying() {
    return this.isPlayingSubject.pipe(
      distinctUntilChanged()
    );
  }

  public get time() {
    return this.timeSubject.pipe(
      distinctUntilChanged()
    );
  }

  public get completed() {
    return this.completeSubject;
  }

  public complete() {
    this.completeSubject.next();
  }

  public play() {
    this.isPlayingSubject.next(true);
  }

  public pause() {
    this.isPlayingSubject.next(false);
  }

  public updateTime(time: number) {
    this.timeSubject.next(time);
  }
}
