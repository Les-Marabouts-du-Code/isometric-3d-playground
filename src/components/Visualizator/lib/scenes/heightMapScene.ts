import Phaser from 'phaser';
import { Cube } from '../objects/Cube';
import Color from '../../../../lib/Isometric3DMap/utils/Color';
import SpacePoint from '../../../../lib/Isometric3DMap/interfaces/spacePoint.interface';
import MapDataToGrid from '../../../../lib/Isometric3DMap/mapdata/mapdatatogrid';
import { IMapGridPoint } from '../../../../lib/Isometric3DMap/interfaces/map-grid-point.interface';

interface IMinMaxHeight {
  minHeight: number;
  maxHeight: number;
}

export class HeightMapScene extends Phaser.Scene {
  /**
   * Map Settings
   */
  private width = 50;
  private size = 30;
  private cubeGroup: Phaser.GameObjects.Group;
  // TODO: using a container is some sort of hack: it allows to getBounds to resize image
  private container: Phaser.GameObjects.Container | null = null;
  private centerX = window.innerWidth / 4;
  private centerY = window.innerHeight / 4;
  private lastPointerCoordinates: { x: number; y: number } = { x: NaN, y: NaN };

  /**
   * Color Settings
   */
  private lowColor: Color;
  private highColor: Color;
  private colorChanged: boolean = false;
  private waterColor: Color = new Color(35, 72, 207);

  public mapData: SpacePoint[] = [];
  public minHeight: number = 0;
  public maxHeight: number = 0;
  private mapDataJSON: any = {};
  private imageBase64?: string;

  constructor({
    data,
    lowColor,
    highColor,
    imageBase64
  }: {
    data: JSON;
    lowColor: string | null;
    highColor: string | null;
    imageBase64?: string;
  }) {
    super({
      key: 'HeightMapScene'
    });

    if (highColor) {
      this.highColor = Color.fromHexa(highColor);
    } else {
      this.highColor = new Color(255, 255, 128);
    }

    if (lowColor) {
      this.lowColor = Color.fromHexa(lowColor);
    } else {
      this.lowColor = new Color(179, 179, 255);
    }

    this.cubeGroup = new Phaser.GameObjects.Group(this);

    this.mapDataJSON = data;
    this.mapData = this.mapDataJSON.results;

    this.imageBase64 = imageBase64;
  }

  private getMinMaxHeight(map: IMapGridPoint[]): IMinMaxHeight {
    return map.reduce(
      (prev: IMinMaxHeight, current: IMapGridPoint) => ({
        minHeight: Math.min(prev.minHeight, current.height),
        maxHeight: Math.max(prev.maxHeight, current.height)
      }),
      { minHeight: 0, maxHeight: 0 }
    );
  }

  create(): void {
    // console.log({textures_create: this.textures})
    let image: HTMLImageElement = new Image(),
      context: CanvasRenderingContext2D | null;
    if (this.imageBase64) {
      image = new Image();
      image.src = this.imageBase64;
      const canvas = document.createElement('canvas');
      context = canvas.getContext('2d');
      context?.drawImage(image, 0, 0);
    }

    function getPixel(x: number, y: number) {
      return context?.getImageData(x, y, 1, 1).data;
    }
    // console.log({textures_constructor: this.textures})

    const gridDataRaw = new MapDataToGrid(this.mapDataJSON.results);
    // TODO: don't get flat grid, get grid, so you know how much cols & rows there are (and get tiles from image)
    const gridData: IMapGridPoint[] = gridDataRaw.getFlatGrid().sort((a, b) => {
      if (a.y < b.y) {
        return -1;
      } else if (a.y > b.y) {
        return 1;
      } else {
        return 0;
      }
    });

    const gridSize = gridDataRaw.getSize();
    const { minHeight, maxHeight } = this.getMinMaxHeight(gridData);
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    const n = gridData.length;
    let row: Cube[] = [];

    // const container = this.add.container(this.centerX, this.centerY);
    // const container = this.add.container(0, 0);
    this.container = this.add.container(0, 0);

    for (let i = 0; i < n; i++) {
      const singleGridData = gridData[i];
      const { x, y } = singleGridData;
      const depth = (this.width * 2) / 4;
      const halfDepth = depth / 2;
      const halfWidth = this.width / 2;
      const height = singleGridData.height;
      const t = (height - this.minHeight) / (this.maxHeight - this.minHeight);

      // TEMP
      // const cx = Phaser.Math.Wrap(x / gridSize.x, 0, imageWidth);
      // const cy = Phaser.Math.Wrap(y / gridSize.y, 0, imageHeight);
      const cx = Math.round((imageWidth * x) / gridSize.x);
      const cy = Math.round((imageHeight * y) / gridSize.y);
      /*
     let color: Color;
      if (height === 0) {
        color = this.waterColor;
      } else {
        color = this.lowColor.lerpTo(this.highColor, t);
      }
      */

      console.log({ cx, cy });
      // FIXME
      const imageData: Uint8ClampedArray | undefined = getPixel(cx, cy);
      // const imageData: Uint8ClampedArray | undefined = getPixel(x, y);
      const _color = imageData
        ? new Color(imageData[0], imageData[1], imageData[2], imageData[3])
        : new Color(0, 0, 0, 0);

      var tx = (x - y) * halfWidth * 0.6;
      var ty = (x + y) * halfDepth * 0.6;

      let cube = new Cube(
        new Phaser.Geom.Point(this.centerX + tx, this.centerY + ty),
        0,
        this.size,
        // this.lowColor,
        // color,
        _color,
        // new Color(255, 255, 255, 1),
        this
      );

      // cube.setDepth(this.centerY + ty);
      row.push(cube);
      this.cubeGroup.add(cube);
      // this.add.existing(cube);
      // const box = this.add.isobox(tx, ty, this.size, height)
      // FIXME
      // container.addAt(cube, this.centerY + ty);
      //container.add(cube);

      // NOTE: color + height tween
      const reverseIndex = n - 1 - i;
      this.tweens.add({
        targets: cube,
        height: singleGridData.height,
        ease: 'Sine.easeOut',
        duration: 1500 + 10 * reverseIndex,
        delay: reverseIndex * 2,
        onUpdate: (args) => {
          const animationProgress = args.elapsed / args.duration;
          // this.updateCubeColor(cube, this.lowColor, color, animationProgress);
        }
      });
    }

    // container.add(row);
    this.cubeGroup.children.each((cube) => {
      //container.addAt(cube, this.centerY + asCube.y);
      if (this.container !== null) {
        this.container.add(cube as Cube);
      }
    });

    // TODO: use this to properly resize image
    // FIXME: (but it could be bullshit)
    console.log(`getBounds`, this.container.getBounds());
    console.log({ cubeGroup: this.cubeGroup, container: this.container });

    this.input.on('pointermove', (o_pointer: Phaser.Input.Pointer) => {
      if (!o_pointer.primaryDown) {
        return;
      }

      if (
        !isNaN(this.lastPointerCoordinates.x) &&
        !isNaN(this.lastPointerCoordinates.y)
      ) {
        this.cameras.main.scrollX -=
          o_pointer.position.x - this.lastPointerCoordinates.x;
        this.cameras.main.scrollY -=
          o_pointer.position.y - this.lastPointerCoordinates.y;
      }

      const {
        tagName
      }: { tagName: string } = o_pointer.manager.activePointer.downElement;

      if (tagName.match(/^canvas$/i)) {
        this.lastPointerCoordinates.x = o_pointer.position.x;
        this.lastPointerCoordinates.y = o_pointer.position.y;
      }
    });

    this.input.on('pointerup', (o_pointer: Phaser.Input.Pointer) => {
      this.lastPointerCoordinates.x = NaN;
      this.lastPointerCoordinates.y = NaN;
    });
  }

  getContainerBounds() {
    return this.container ? this.container.getBounds() : null;
  }

  handleColorChange(lowColor: string, highColor: string) {
    // FIXME
    /*
    this.colorChanged = true;
    this.lowColor = Color.fromHexa(lowColor);
    this.highColor = Color.fromHexa(highColor);
    */
  }

  updateCubeColor(
    cube: Cube,
    startColor: Color,
    endColor: Color,
    rate: number
  ) {
    if (rate >= 1) {
      return;
    }
    const newColor = startColor.lerpTo(endColor, rate);
    cube.colorize(newColor);
  }

  private updateColor() {
    this.cubeGroup.children.iterate((child) => {
      const cube: Cube = child as Cube;
      const delta =
        (cube.height - this.minHeight) / (this.maxHeight - this.minHeight);
      const color = this.lowColor.lerpTo(this.highColor, delta);
      cube.colorize(color);
    });
  }

  update(time: number): void {
    if (this.colorChanged) {
      this.updateColor();
      this.colorChanged = false;
    }
  }
}
