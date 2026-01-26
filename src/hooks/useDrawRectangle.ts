import { Reducer, useEffect, useReducer } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Dimensions {
  width: number;
  height: number;
}

export type Rectangle = Point & Dimensions;

export type StartDrawingFunction = (point: Point) => void;

interface UseDrawRectangleState {
  startDrawing: StartDrawingFunction;
  stopDrawing: () => void;
  rectangle: Rectangle;
  isDrawing: boolean;
}

type State = Rectangle & {
  isDrawing: boolean;
};
type Action =
  | { type: 'startDrawing'; x: number; y: number }
  | { type: 'stopDrawing' }
  | { type: 'draw'; width: number; height: number };

const initState: State = {
  x: NaN,
  y: NaN,
  width: 0,
  height: 0,
  isDrawing: false
};

const reducer = (prevState: State, action: Action): State => {
  switch (action.type) {
    case 'startDrawing':
      return {
        ...prevState,
        x: action.x,
        y: action.y, 
        isDrawing: true
      };
    case 'draw':
      return {
        ...prevState,
        width: action.width,
        height: action.height
      };
    case 'stopDrawing':
      return {
        ...prevState,
        isDrawing: false
      };
    default:
      return prevState;
  }
};

export const useDrawRectangle = (): UseDrawRectangleState => {
  const [{ x, y, width, height, isDrawing }, dispatch] = useReducer<
    Reducer<State, Action>
  >(reducer, initState);

  const handleMouseMove = (event: MouseEvent) => {
    const rectangleWidth = event.clientX - x;
    const rectangleHeight = event.clientY - y;
    dispatch({ type: 'draw', width: rectangleWidth, height: rectangleHeight });
  };

  const addMouseMoveHandler = (add: boolean = true) => {
    if (add) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }
  };

  useEffect(() => {
    addMouseMoveHandler(isDrawing);

    return () => {
      addMouseMoveHandler(false);
    };
  }, [isDrawing, addMouseMoveHandler]);

  const startDrawing: StartDrawingFunction = ({ x, y }) => {
    if (!isDrawing) {
      dispatch({ type: 'startDrawing', x, y });
    }
  };

  const stopDrawing = (): void => {
    dispatch({ type: 'stopDrawing' });
  };

  return {
    startDrawing,
    stopDrawing,
    rectangle: {
      x,
      y,
      width,
      height
    }, 
    isDrawing
  };
};
