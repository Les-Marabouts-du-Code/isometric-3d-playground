import { useEffect, useState } from 'react';

import { IOptionSelectorProps } from './OptionSelector';

const LOW_COLOR_KEY = 'isp_lowColor';
const HIGH_COLOR_KEY = 'isp_highColor';

type UseOptionSelectorProps = {
  defaultLowColor: string;
  defaultHighColor: string;
};

export function useOptionSelector(
  props: UseOptionSelectorProps
): IOptionSelectorProps {
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

  function onResetColors() {
    setLowColor(props.defaultLowColor);
    setHighColor(props.defaultHighColor);
  }

  return {
    lowColor,
    highColor,
    onLowColorChange: setLowColor,
    onHighColorChange: setHighColor,
    onResetColors
  };
}
