import React, { useEffect, useState, useCallback } from 'react';
import Phaser from 'phaser';
import IsoGame from './lib/IsoGame';
import { HeightMapScene } from './lib/scenes/heightMapScene';
import OptionSelector from '../OptionSelector/OptionSelector';

interface IVisualizatorProps {
  mapData: JSON;
  imageData?: string;
}
const Visualizator = (props: IVisualizatorProps) => {
  const getWindowWidth = () => window.innerWidth;
  const getWindowHeight = () => window.innerHeight;

  // TODO: useRef here?
  // eslint-disable-next-line
  const [vizualizatorEl, setVisualizatorElement] = useState('display-el');
  const [width, setWidth] = useState(getWindowWidth());
  const [height, setHeight] = useState(getWindowHeight());

  const localHighColor = localStorage.getItem('isp_highColor');
  const localLowColor = localStorage.getItem('isp_lowColor');
  const [game, setGame] = useState<IsoGame>();
  // FIXME
  const [gameContainerBounds, setGameContainerBounds] = useState<any>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  const scene = new HeightMapScene({
    data: props.mapData,
    imageBase64: props.imageData,
    lowColor: localLowColor,
    highColor: localHighColor
  });

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (game) {
      return;
    }
    setGame(
      new IsoGame({
        parent: vizualizatorEl,
        scene,
        scale: {
          parent: vizualizatorEl,
          mode: Phaser.Scale.NONE,
          width,
          height
        }
      })
    );
  }, [props.mapData]);

  const handleResize = useCallback(() => {
    setWidth(getWindowWidth());
    setHeight(getWindowHeight());
  }, []);

  useEffect(() => {
    if (game) {
      game.canvas.width = width;
      game.canvas.height = height;
      game.scale.resize(width, height);
    }
  }, [width, height, game]);

  useEffect(() => {
    if (game && game.getContainerBounds()) {
      setGameContainerBounds(game.getContainerBounds());
    }
  }, [game]);

  function handleColorChange(lowColor: string, highColor: string) {
    if (game) {
      game.colorChanged(lowColor, highColor);
    }
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          background: 'white',
          width: '300px',
          height: '100px',
          fontSize: '10px',
          padding: '10px'
        }}
      >
        {JSON.stringify(gameContainerBounds)}
      </div>
      {/* TEMP */}
      {props.imageData && game !== null && (
        <img
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 200
          }}
          src={props.imageData}
        />
      )}
      {/* {props.imageData && game !== null && (
        <img
          style={{
            width: gameContainerBounds.width,
            height: gameContainerBounds.height,
            transform: `skew(-62deg, 27deg)`,
            opacity: `0.4`,
            position: 'absolute',
            top: 100,
            left: 100, 
          }}
          src={props.imageData}
        />
      )} */}
      <div id="display-el"></div>
      {game && <OptionSelector onColorChange={handleColorChange} />}
    </>
  );
};

export default Visualizator;
