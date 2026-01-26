import { useEffect, useState } from 'react';

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
    localStorage.getItem('isp_lowColor') ?? props.defaultLowColor
  );
  const [highColor, setHighColor] = useState<string>(
    localStorage.getItem('isp_highColor') ?? props.defaultHighColor
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
