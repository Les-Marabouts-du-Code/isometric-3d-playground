import React, { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import {
  Paper,
  Button,
  ButtonBase,
  Typography,
  IconButton,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface IOptionSelectorProps {
  lowColor: string;
  onLowColorChange: (lowColor: string) => void;
  highColor: string;
  onHighColorChange: (lowColor: string) => void;
  onResetColors?: () => void;
}

const PREFIX = 'OptionSelector';

const classes = {
  closed: `${PREFIX}-closed`,
  open: `${PREFIX}-open`
};

const RootPaper = styled(Paper)(() => ({
  position: 'absolute',
  right: 10,
  bottom: 10,
  background: '#fff',
  transition: 'width .2s ease-in-out, height .2s ease-in-out',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  [`&.${classes.open}`]: {
    width: 470
  },
  [`&.${classes.closed}`]: {
    width: 60,
    height: 32
  }
}));

const MenuButton = styled(ButtonBase)(() => ({
  flex: 1
}));

const PopOver = styled('div')(() => ({
  position: 'absolute',
  zIndex: 2,
  bottom: 60
}));

const Cover = styled('div')(() => ({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}));

const OptionSelector = (props: IOptionSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [highColorPickerOpen, setHighColorPickerOpen] = useState(false);
  const [lowColorPickerOpen, setLowColorPickerOpen] = useState(false);

  function openMenu() {
    setOpen(true);
  }

  function toggleHighColorPicker() {
    setHighColorPickerOpen(!highColorPickerOpen);
  }
  function toggleLowColorPicker() {
    setLowColorPickerOpen(!lowColorPickerOpen);
  }
  function closeMenu() {
    setOpen(false);
  }

  function onHighColorChangeComplete(color: ColorResult) {
    props.onHighColorChange(color.hex);
  }

  function onLowColorChangeComplete(color: ColorResult) {
    props.onLowColorChange(color.hex);
  }

  return (
    <RootPaper className={open ? classes.open : classes.closed}>
      {open ? (
        <>
          <>
            <Button
              onClick={() => {
                toggleHighColorPicker();
              }}
            >
              Couleur Haute
            </Button>
            {highColorPickerOpen ? (
              <PopOver>
                <Cover onClick={toggleHighColorPicker} />
                <ChromePicker
                  onChangeComplete={onHighColorChangeComplete}
                  color={props.highColor}
                />
              </PopOver>
            ) : null}
          </>
          <>
            <Button
              onClick={() => {
                toggleLowColorPicker();
              }}
            >
              Couleur Basse
            </Button>
            {lowColorPickerOpen ? (
              <PopOver>
                <Cover onClick={toggleLowColorPicker} />
                <ChromePicker
                  onChangeComplete={onLowColorChangeComplete}
                  color={props.lowColor}
                />
              </PopOver>
            ) : null}
          </>
          {props.onResetColors && (
            <Button onClick={props.onResetColors}>🗑</Button>
          )}
          <IconButton
            aria-label="delete"
            onClick={(event) => {
              closeMenu();
            }}
          >
            <CloseIcon />
          </IconButton>
        </>
      ) : (
        <MenuButton
          focusRipple
          disableRipple={open}
          onClick={() => {
            openMenu();
          }}
        >
          <Typography>Menu</Typography>
        </MenuButton>
      )}
    </RootPaper>
  );
};
export default OptionSelector;
