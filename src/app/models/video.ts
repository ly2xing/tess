import { CameraPosition } from '../enums/CameraPosition.enum';

export class Video {
  constructor(
    public cameraPosition: CameraPosition,
    public src?: string,
  ) {}
}
