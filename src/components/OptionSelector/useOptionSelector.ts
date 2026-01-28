import { useEffect, useState } from 'react';

const LOW_COLOR_KEY = 'isp_lowColor';
const HIGH_COLOR_KEY = 'isp_highColor';

type UseMapColorsProps = {
  defaultLowColor: string;
  defaultHighColor: string;
};

type UseMapColorsReturnProps = {
  lowColor: string;
  highColor: string;
  setLowColor: (lowColor: string) => void;
  setHighColor: (highColor: string) => void;
};

export function useMapColors(
  props: UseMapColorsProps
): UseMapColorsReturnProps {
  const [lowColor, setLowColor] = useState<string>(
    localStorage.getItem(LOW_COLOR_KEY) ?? props.defaultLowColor
  );
  const [highColor, setHighColor] = useState<string>(
    localStorage.getItem(HIGH_COLOR_KEY) ?? props.defaultHighColor
  );

  useEffect(() => {
    localStorage.setItem(LOW_COLOR_KEY, lowColor);
  }, [lowColor]);

  useEffect(() => {
    localStorage.setItem(HIGH_COLOR_KEY, highColor);
  }, [highColor]);

  return {
    lowColor,
    highColor,
    setLowColor,
    setHighColor
  };
}
