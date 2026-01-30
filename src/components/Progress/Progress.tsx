import React from 'react';
import { CircularProgress } from '@mui/material';
import { withStyles } from 'tss-react/mui';
import './Progress.scss';

type Props = {
  color?: string;
};

export default function Progress(props: Props) {
  const ColorCircularProgress = withStyles(CircularProgress, {
    root: {
      color: props.color || '#000',
      backgroundColor: 'none'
    }
  });

  return (
    <div className="loader-container">
      <ColorCircularProgress className="progress"></ColorCircularProgress>
      <p>Fetching data...</p>
    </div>
  );
}
