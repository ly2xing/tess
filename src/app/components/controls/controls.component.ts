import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/video';
import { CameraPosition } from '../../enums/CameraPosition.enum';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.sass']
})
export class ControlsComponent implements OnInit {

  public videoUrls = {};
  public files: any[];
  public fileTimes: string[] = [];
  public playingFileName: string;

  public selectedVideos: any[] = [];

  public isPlaying: boolean = false;
  public time = 0;
  public duration = 0;

  public isDrawerOpen: boolean = false;

  @Output()
  public videoSelected: EventEmitter<Video[]> = new EventEmitter();

  constructor(private videoService: VideoService) { }

  ngOnInit() {
    this.videoService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying);
    this.videoService.time.subscribe(time => this.time = time);
    this.videoService.duration.subscribe(duration => this.duration = duration);
    this.videoService.completed.subscribe(() => this.onNext());
  }

  public onChange(event) {
    this.files = event.target.files;
    this.fileTimes = [];
    this.selectedVideos = [];
    this.videoUrls = {};

    for (let i = 0; i < this.files.length; i++) {
      this.videoUrls[this.files[i].name] = URL.createObjectURL(this.files[i]);
      const timeStamp = this.getTimeStamp(this.files[i]);
      if (this.fileTimes.indexOf(timeStamp) < 0) {
        this.fileTimes.push(timeStamp);
      }
    }
  }

  private getTimeStamp(file) {
    return file.name.slice(0, 19);
  }

  public onFileChange(fileName: string) {
    this.selectedVideos = [];
    const files = [];
    for (let i = 0; i < this.files.length; i++) {
      if (this.files[i].name.indexOf(fileName) > -1) {
        files.push(this.files[i]);
      }
    }
    for (let i = 0; i < files.length; i++) {
      const videoUrl = this.videoUrls[files[i].name];
      const video = new Video(CameraPosition.Left, videoUrl);
      if (files[i].name.lastIndexOf('front') > -1) {
        video.cameraPosition = CameraPosition.Center;
      } else if (files[i].name.lastIndexOf('left_repeater') > -1) {
        video.cameraPosition = CameraPosition.Left;
      } else if (files[i].name.lastIndexOf('right_repeater') > -1) {
        video.cameraPosition = CameraPosition.Right;
      }
      this.selectedVideos.push(video);
    }
    this.playingFileName = fileName;
    this.videoSelected.emit(this.selectedVideos);
  }

  public onPrevious() {
    const currentIndex = this.fileTimes.indexOf(this.playingFileName);
    const previousIndex = currentIndex - 1;
    if (previousIndex > -1) {
      this.onFileChange(this.fileTimes[previousIndex]);
    }
  }

  public onNext() {
    const currentIndex = this.fileTimes.indexOf(this.playingFileName);
    const nextIndex = currentIndex + 1;
    if (this.fileTimes.length > nextIndex) {
      this.onFileChange(this.fileTimes[nextIndex]);
    } else {
      this.isPlaying = false;
      this.playingFileName = '';
    }
  }

  public onPlayClick() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.videoService.play();
    } else {
      this.videoService.pause();
    }
  }

  public onScrub(event) {
    const time = event.target.value;
    this.videoService.seekTo(time);
  }

  public onDrawerOpen() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  public onFastForward() {
    this.videoService.seekTo(Math.min(this.duration, this.time + 10));
  }

  public onFastRewind() {
    this.videoService.seekTo(Math.max(0, this.time - 10));
  }

  public formatTime(time: number) {
    return (Math.floor(time / 60)).toString()
      .padStart(2, '0')
      + ':' +
      (Math.floor(time % 60)).toString()
        .padStart(2, '0');
  }
}
