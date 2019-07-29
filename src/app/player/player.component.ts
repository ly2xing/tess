import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
import { Video } from '../models/video';
import { VideoSet } from '../models/video-set';
import { VideoProperties } from '../components/video/video.component';
import { CameraPosition } from '../enums/CameraPosition.enum';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.sass']
})
export class PlayerComponent implements OnInit {

  public videoSet: VideoSet;
  public videoCompleted = {};

  constructor(private videoService: VideoService) { }

  ngOnInit() {
  }

  public onVideoSelected(videos: Video[]) {
    this.videoCompleted = {};
    if (!this.videoSet) {
      this.videoSet = VideoSet.createFromVideos(videos);
    } else {
      this.videoSet.setToVideos(videos);
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
