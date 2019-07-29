import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private isPlayingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private timeSubject: Subject<number> = new Subject();
  private completeSubject: Subject<void> = new Subject();
  private durationSubject: Subject<number> = new Subject();
  private seekSubject: Subject<number> = new Subject();

  public get isPlaying() {
    return this.isPlayingSubject.pipe(
      distinctUntilChanged()
    );
  }

  public get time() {
    return this.timeSubject.pipe(
      map(time => Math.floor(time)),
      distinctUntilChanged()
    );
  }

  public get duration() {
    return this.durationSubject.pipe(
      map(time => Math.floor(time)),
      distinctUntilChanged()
    );
  }

  public get seek() {
    return this.seekSubject.pipe(
      map(time => Math.floor(time))
    )
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

  public seekTo(time: number) {
    this.seekSubject.next(time);
  }

  public updateTime(time: number) {
    this.timeSubject.next(time);
  }

  public updateDuration(duration: number) {
    this.durationSubject.next(duration);
  }
}
