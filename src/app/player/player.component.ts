import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
import { Video } from '../models/video';
import { VideoSet } from '../models/video-set';
import { VideoProperties } from '../components/video/video.component';
import { CameraPosition } from '../enums/CameraPosition.enum';
import { DisplayMode } from '../enums/DisplayMode.enum';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.sass']
})
export class PlayerComponent implements OnInit {

  public videoSet: VideoSet;
  public videoCompleted = {};
  public displayMode = DisplayMode.Dynamic;
  public CameraPosition = CameraPosition;
  public DisplayMode = DisplayMode;

  constructor(private videoService: VideoService) { }

  ngOnInit() {
  }

  public onVideoSelected(videoSet: VideoSet) {
    this.videoCompleted = {};
    if (!this.videoSet) {
      this.videoSet = videoSet;
    } else {
      this.videoSet.setTo(videoSet);
    }
  }

  public onVideoLoaded(videoProperties: VideoProperties) {
    if (videoProperties.position === CameraPosition.Center) {
      this.videoService.updateDuration(videoProperties.duration);
    }
  }

  public onVideoUpdated(videoProperties: VideoProperties) {
    if (videoProperties.position === CameraPosition.Center) {
      this.videoService.updateTime(videoProperties.currentTime);
    }
  }

  public onComplete(video: Video) {
    this.videoCompleted[video.src] = true;
    if (Object.keys(this.videoCompleted).length === this.videoSet.validKeys.length) {
      this.videoService.complete();
    }
  }
}
