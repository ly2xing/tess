import { Video } from './video';

export class VideoSet {
  public 1: Video;
  public 2: Video;
  public 3: Video;

  public array: Video[];

  public validKeys = [];

  public toArray() {
    if (!this.array) {
      this.array = this.validKeys.sort().map(key => this[key]);
    }
    return this.array;
  }

  public setToVideos(videos: Video[]) {
    for (let video of videos) {
      this[video.cameraPosition].src = video.src;
    }
  }

  public static createFromVideos(videos: Video[]) {
    const set = new VideoSet();
    console.log(videos);
    for (let video of videos) {
      set[video.cameraPosition] = video;
      set.validKeys.push(video.cameraPosition);
    }
    return set;
  }
}
