import { useState } from 'react';

type UseMapColorsReturnProps = {
  lowColor: string;
  highColor: string;
  setLowColor: (lowColor: string) => void;
  setHighColor: (highColor: string) => void;
};

export function useMapColors(): UseMapColorsReturnProps {
  const [lowColor, setLowColor] = useState<string>('');
  const [highColor, setHighColor] = useState<string>('');

  return {
    lowColor,
    highColor,
    setLowColor,
    setHighColor
  };
}
