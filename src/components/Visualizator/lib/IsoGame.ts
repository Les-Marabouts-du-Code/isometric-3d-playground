import Phaser from 'phaser';
import { HeightMapScene } from './scenes/heightMapScene';

export default class IsoGame extends Phaser.Game {
  public colorChanged(lowColor: string, highColor: string) {
    const scene = this.scene.getScene('HeightMapScene') as HeightMapScene;
    // FIXME scene can be undefined?! WTF?!
    if(scene) {
      scene.handleColorChange(lowColor, highColor);
    }
  }

  public getContainerBounds() {
    const scene = this.scene.getScene('HeightMapScene') as HeightMapScene;
    if(scene) {
      return scene.getContainerBounds();
    }
    else {
      return null;
    }
  }
}
