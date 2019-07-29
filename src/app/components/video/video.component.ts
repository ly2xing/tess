import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { Subscription } from 'rxjs';
import { Video } from '../../models/video';
import { CameraPosition } from '../../enums/CameraPosition.enum';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.sass']
})
export class VideoComponent implements OnInit, OnDestroy {

  @ViewChild('videoElement', {static:true})
  videoElement: ElementRef;

  @Input()
  public video: Video;

  @Output()
  public loaded: EventEmitter<VideoProperties> = new EventEmitter();

  @Output()
  public update: EventEmitter<VideoProperties> = new EventEmitter();

  @Output()
  public complete: EventEmitter<void> = new EventEmitter();

  private subscriptions: Subscription;

  constructor(private videoService: VideoService) { }

  ngOnInit() {
    this.subscriptions = this.videoService.isPlaying.subscribe(
      isPlaying => {
        if (isPlaying) {
          this.videoElement.nativeElement.play();
        } else {
          this.videoElement.nativeElement.pause();
        }
      }
    );
    this.subscriptions.add(this.videoService.seek.subscribe(
      time => {
        this.videoElement.nativeElement.currentTime = time;
      }
    ))
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  public onLoadedData(event) {
    event.target.play();
    this.loaded.emit(this.getVideoProperties(event.target));
    this.videoService.play();
  }

  public onTimeUpdate(event) {
    this.update.emit(this.getVideoProperties(event.target));
  }

  public onEnded() {
    this.complete.emit();
  }

  private getVideoProperties(videoElement: any) {
    if (!videoElement) {
      return {
        currentTime: 0,
        duration: 0,
        position: this.video.cameraPosition
      }
    }
    return {
      currentTime: videoElement.currentTime,
      duration: videoElement.duration,
      position: this.video.cameraPosition
    };
  }

}

export interface VideoProperties {
  currentTime: number;
  duration: number;
  position: CameraPosition;
}
