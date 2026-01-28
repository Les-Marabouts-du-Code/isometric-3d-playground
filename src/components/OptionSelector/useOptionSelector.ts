import { useEffect, useState } from 'react';

import { IOptionSelectorProps } from './OptionSelector';

const LOW_COLOR_KEY = 'isp_lowColor';
const HIGH_COLOR_KEY = 'isp_highColor';

type UseOptionSelectorProps = {
  defaultLowColor: string;
  defaultHighColor: string;
};

type State = {
  lowColor: string;
  highColor: string;
};

export function useOptionSelector(
  props: UseOptionSelectorProps
): IOptionSelectorProps {
  const [{ lowColor, highColor }, setState] = useState<State>({
    lowColor: localStorage.getItem(LOW_COLOR_KEY) ?? props.defaultLowColor,
    highColor: localStorage.getItem(HIGH_COLOR_KEY) ?? props.defaultHighColor
  });

  function onLowColorChange(color: string) {
    setState((prevState) => ({
      ...prevState,
      lowColor: color
    }));
  }

  function onHighColorChange(color: string) {
    setState((prevState) => ({
      ...prevState,
      highColor: color
    }));
  }

  useEffect(() => {
    localStorage.setItem(LOW_COLOR_KEY, lowColor);
  }, [lowColor]);

  useEffect(() => {
    localStorage.setItem(HIGH_COLOR_KEY, highColor);
  }, [highColor]);

  function onResetColors() {
    setState({
      lowColor: props.defaultLowColor,
      highColor: props.defaultHighColor
    });
  }

  return {
    lowColor,
    highColor,
    onLowColorChange,
    onHighColorChange,
    onResetColors
  };
}
