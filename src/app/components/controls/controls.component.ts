import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/video';
import { CameraPosition } from '../../enums/CameraPosition.enum';
import { VideoSet } from '../../models/video-set';
import { getTimestamp } from '../../../helpers/timestamp';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.sass']
})
export class ControlsComponent implements OnInit {

  public videoUrls = {};
  public files: any[];
  public eventJson: any;
  public fileTimes: string[] = [];
  public playingFileName: string;

  public selectedVideos: any[] = [];

  public isPlaying: boolean = false;
  public time = 0;
  public duration = 0;
  public useNativeFileApi = false;

  public isDrawerOpen = false;

  @Output()
  public videoSelected: EventEmitter<VideoSet> = new EventEmitter();

  constructor(private videoService: VideoService) { }

  ngOnInit() {
    this.videoService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying);
    this.videoService.time.subscribe(time => this.time = time);
    this.videoService.duration.subscribe(duration => this.duration = duration);
    this.videoService.completed.subscribe(() => this.onNext());
    if ('chooseFileSystemEntries' in window) {
      this.useNativeFileApi = true;
    }
  }

  public async onChange(event) {
    this.files = Array.prototype.slice.call(event.target.files);
    const eventJsonFile = this.files.find(a => a.name === 'event.json');
    this.eventJson = await this.readEventJson(eventJsonFile);
    this.files.sort((a, b) => (a.name < b.name) ? -1 : 1);
    this.fileTimes = [];
    this.selectedVideos = [];
    this.videoUrls = {};

    for (let i = 0; i < this.files.length; i++) {
      this.videoUrls[this.files[i].name] = URL.createObjectURL(this.files[i]);
      const timeStamp = this.getTimeStampString(this.files[i]);
      if (this.fileTimes.indexOf(timeStamp) < 0) {
        this.fileTimes.push(timeStamp);
      }
    }
  }

  private async readEventJson(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        let result;
        try {
          result = JSON.parse(e.target.result as string);
        } catch (e) {
          console.warn('event.json contains invalid JSON:', e.target.result);
        }
        finally {
          resolve(result);
        }
      };
      fileReader.onerror = reject;
      fileReader.readAsText(file);
    });
  }

  private getTimeStampString(file) {
    return file.name.slice(0, 19);
  }

  public async onNativeFileClick() {
    const handle = await (window as any).chooseFileSystemEntries({
      accepts: [{ mimeTypes: ['video/*']}],
      type: 'openDirectory'
    });
    const entries = await handle.getEntries();
    const event = {target: {files: []}};
    for await (const entry of entries) {
      const kind = entry.isFile ? 'File' : 'Directory';
      const file = await entry.getFile();
      event.target.files.push(file);
    }
    this.onChange(event);
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
      } else if (files[i].name.lastIndexOf('back') > -1) {
        video.cameraPosition = CameraPosition.Rear;
      }
      this.selectedVideos.push(video);
    }
    this.playingFileName = fileName;
    const timestamp = getTimestamp(this.getTimeStampString(files[0]), 'YYYY-MM-DD_HH-mm-ss');
    const videoSet = VideoSet.createFromVideos(this.selectedVideos, timestamp, this.eventJson);
    this.videoSelected.emit(videoSet);
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
