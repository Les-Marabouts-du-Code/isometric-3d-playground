import React, { useState, useCallback, useEffect } from 'react';
import { Map, MapProps } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_MAP_HEIGHT = 600;

const CustomMap = React.forwardRef<Map, MapProps>((props, ref) => {
  const [mapHeight, setMapHeight] = useState(DEFAULT_MAP_HEIGHT);

  const handleResize = useCallback(() => setMapHeight(window.innerHeight), []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <Map
      {...props}
      preferCanvas
      style={{ width: '100%', height: `${mapHeight}px` }}
      ref={ref}
    >
      {props.children}
    </Map>
  );
});

export default CustomMap;
