import { useEffect, useState } from 'react';

type UseMapColorsReturnProps = {
  lowColor: string;
  highColor: string;
  setLowColor: (lowColor: string) => void;
  setHighColor: (highColor: string) => void;
};

export function useMapColors(): UseMapColorsReturnProps {
  const [lowColor, setLowColor] = useState<string>(
    localStorage.getItem('isp_lowColor') ?? '#fff'
  );
  const [highColor, setHighColor] = useState<string>(
    localStorage.getItem('isp_highColor') ?? '#fff'
  );

  useEffect(() => {
    localStorage.setItem('isp_lowColor', lowColor);
  }, [lowColor]);

  useEffect(() => {
    localStorage.setItem('isp_highColor', highColor);
  }, [highColor]);

  return {
    lowColor,
    highColor,
    setLowColor,
    setHighColor
  };
}
