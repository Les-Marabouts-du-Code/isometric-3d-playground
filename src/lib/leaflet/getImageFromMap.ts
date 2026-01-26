// @ts-ignore
import leafletImage from 'leaflet-image';
import { Map } from 'react-leaflet';

const DEFAULT_MAX_IMAGE_SIZE = 50;

export const getImageFromMap = async ({
  map,
  rectangle,
  onComplete,
  maxImageSize = DEFAULT_MAX_IMAGE_SIZE
}: {
  map: Map;
  rectangle: { width: number; height: number; x: number; y: number };
  onComplete: (params: {
    imageBase64: string;
    imageSize: { width: number; height: number };
  }) => void;
  maxImageSize: number;
}) => {
  leafletImage(map.leafletElement, function (err: any, canvas: any) {
    const tempCanvas = document.createElement('canvas');
    // NOTE: calculation of images' dimensions
    const horizontalRatio = maxImageSize / rectangle.width;
    const verticalRatio = maxImageSize / rectangle.height;
    const resizeRatio = Math.min(horizontalRatio, verticalRatio);
    tempCanvas.width = Math.round(resizeRatio * rectangle.width);
    tempCanvas.height = Math.round(resizeRatio * rectangle.height);

    tempCanvas
      .getContext('2d')
      ?.drawImage(
        canvas,
        rectangle.x,
        rectangle.y,
        rectangle.width,
        rectangle.height,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );

    const dataURL = (tempCanvas as HTMLCanvasElement).toDataURL();
    onComplete({
      imageBase64: dataURL,
      imageSize: {
        width: tempCanvas.width,
        height: tempCanvas.height
      }
    });
    //
  });
};
