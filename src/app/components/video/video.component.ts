import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { Subscription } from 'rxjs';
import { Video } from '../../models/video';

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
  public complete: EventEmitter<void> = new EventEmitter();

  private isPlayingSubscription: Subscription;

  constructor(private videoService: VideoService) { }

  ngOnInit() {
    this.isPlayingSubscription = this.videoService.isPlaying.subscribe(
      isPlaying => {
        if (isPlaying) {
          this.videoElement.nativeElement.play();
        } else {
          this.videoElement.nativeElement.pause();
        }
      }
    )
  }

  ngOnDestroy(): void {
    if (this.isPlayingSubscription) {
      this.isPlayingSubscription.unsubscribe();
    }
  }

  public onLoadedData(event) {
    event.target.play();
    this.videoService.play();
  }

  public onEnded() {
    this.complete.emit();
  }

}
