import { Video } from './video';
import { CameraPosition } from '../enums/CameraPosition.enum';

export class VideoSet {

  public array: Video[];
  public dynamicVideoSet: Video[][];
  public eventJson: any;
  public timestamp: any;

  public validKeys = [];

  public static createFromVideos(videos: Video[], timestamp, eventJson?) {
    const set = new VideoSet();
    set.eventJson = eventJson;
    set.timestamp = timestamp;
    for (const video of videos) {
      set[video.cameraPosition] = video;
      set.validKeys.push(video.cameraPosition);
    }
    return set;
  }

  public toArray() {
    if (!this.array) {
      this.array = this.validKeys.sort().map(key => this[key]);
    }
    return this.array;
  }

  public toDynamic(): Video[][] {
    if (!this.dynamicVideoSet) {
      this.dynamicVideoSet = [];
      [
        [CameraPosition.LeftCenter, CameraPosition.Left],
        [CameraPosition.Center, CameraPosition.Rear],
        [CameraPosition.RightCenter, CameraPosition.Right]
      ].map(positions => {
        const videoColumn = this.getVideoColumnOf(positions);
        if (videoColumn.length > 0) {
          this.dynamicVideoSet.push(videoColumn);
        }
      });
    }
    return this.dynamicVideoSet;
  }

  public getVideoColumnOf(positions: CameraPosition[]): Video[] {
    const ret = [];
    for (const pos of positions) {
      if (this.validKeys.indexOf(pos) > -1) {
        ret.push(this[pos]);
      }
    }
    return ret;
  }

  public setTo(videos: VideoSet) {
    this.eventJson = videos.eventJson;
    this.timestamp = videos.timestamp;
    for (const video of videos.array) {
      this[video.cameraPosition].src = video.src;
    }
  }
}
