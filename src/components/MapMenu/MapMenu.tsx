import React, { useRef, useState } from 'react';
import {
  TileLayer,
  Rectangle as LeafletRectangle,
  PathProps,
  Map
} from 'react-leaflet';
import {
  LatLngLiteral,
  LatLngBoundsExpression,
  LeafletEvent,
  DragEndEvent,
  LeafletMouseEvent
} from 'leaflet';
import CustomMap from '../CustomMap/CustomMap';
import { useDrawRectangle } from '../../hooks/useDrawRectangle';
import AreaSelector from '../AreaSelector/AreaSelector';
import { getImageFromMap } from '../../lib/leaflet';

const MAX_IMAGE_SIZE = 50;

interface IMapArea {
  latitude: number;
  longitude: number;
  width: number;
  height: number;
}

interface IMapAreaFile extends IMapArea {
  file: string;
}

interface IMapInitialSettings extends LatLngLiteral {
  zoom: number;
}

export type Props = {
  lat?: number;
  lng?: number;
  areas: IMapAreaFile[];
  onClickArea: (file: string) => void;
  onSelectArea?: (params: {
    areaImageBase64: string;
    areaCoordinates: {
      latitude: number;
      longitude: number;
      width: number;
      height: number;
      longitudeSteps: number;
    };
  }) => void;
};

const defaultPosition: LatLngLiteral = {
  lat: 51.5,
  lng: -0.09
};
const defaultZoom: number = 5;

const getBoundsFromMapArea = (area: IMapArea): LatLngBoundsExpression => {
  return [
    [area.latitude, area.longitude],
    [area.latitude - area.height, area.longitude + area.width]
  ];
};

const getMapInitialSettings = (): IMapInitialSettings => {
  const mapSettingsString: string = localStorage.getItem('mapSettings') || '';
  let mapSettings: IMapInitialSettings;
  try {
    mapSettings = JSON.parse(mapSettingsString);
  } catch (e) {
    mapSettings = {
      zoom: defaultZoom,
      ...defaultPosition
    };
  }
  return mapSettings;
};

const storeMapCurrentSettings = (settings: IMapInitialSettings) => {
  localStorage.setItem('mapSettings', JSON.stringify(settings));
};

interface IMapSelectableArea {
  width: number;
  height: number;
  lng: number;
  lat: number;
}

const getMapArea = (
  point1: LatLngLiteral,
  point2: LatLngLiteral
): IMapSelectableArea => {
  const width: number = Math.abs(point1.lng - point2.lng);
  const height: number = Math.abs(point1.lat - point2.lat);
  const lng: number = Math.min(point1.lng, point2.lng);
  const lat: number = Math.max(point1.lat, point2.lat);

  return {
    width,
    height,
    lng,
    lat
  };
};

export default function MapMenu(props: Props) {
  const { isDrawing, startDrawing, stopDrawing, rectangle } =
    useDrawRectangle();
  // TEMP?
  const [selectArea, setSelectArea] = useState<any>();
  const { zoom: initialZoom, ...initialPosition } = getMapInitialSettings();

  const map = useRef<Map | null>(null);

  const pathProps: PathProps = {
    fillColor: '#ffffff',
    stroke: true,
    weight: 4,
    color: '#d03030'
  };

  // TODO: get this out of here (parent MapMenu)
  // TODO: get a screenshot of the selected area, add a callback in props
  const onRectangleDrawn = (area: IMapSelectableArea) => {
    console.log(`onRectangleDrawn`);
    console.log(`map.current?.leafletElement`, map);
    if (map.current?.leafletElement) {
      getImageFromMap({
        map: map.current,
        rectangle: rectangle,
        maxImageSize: MAX_IMAGE_SIZE,
        onComplete: (params) => {
          // TODO: get this out of here
          localStorage.setItem('mapImage', params.imageBase64);

          if (props.onSelectArea) {
            props.onSelectArea({
              areaImageBase64: params.imageBase64,
              areaCoordinates: {
                width: area.width,
                height: area.height,
                latitude: area.lat,
                longitude: area.lng,
                // FIXME: this param certainly shouldn't be here
                longitudeSteps: params.imageSize.width
              }
            });
          }

          // TODO: call callback to tell parent what to fetch
          /*
        fetchAreaElevation({
          latitude: lat,
          longitude: lng,
          width: width,
          height: height,
          // longitudeSteps: 40
          longitudeSteps: tempCanvas.width
        })
          .then((data) => {
            localStorage.setItem('mapFetchedData', JSON.stringify(data));
            history.push('/isometric');
            console.log({data});
          })
          .catch((error: Error) => {
            console.log(`Error fetching data: ${error.message}`);
            //this.fetchDataError(error.message);
          });
          */
        }
      });
    }
  };

  const onClickMap = (event: LeafletMouseEvent) => {
    const { x, y } = event.containerPoint;
    const { lat, lng } = event.latlng;
    if (!isDrawing) {
      startDrawing({
        x,
        y
      });
      setSelectArea({
        lat,
        lng
      });
    } else {
      const mapArea = getMapArea(selectArea, { lng, lat });
      onRectangleDrawn(mapArea);
      stopDrawing();
    }
  };

  const onClickRectangle = (file: string) => () => {
    props.onClickArea(file);
  };

  const onMapSettingsUpdate = (event: LeafletEvent | DragEndEvent) => {
    storeMapCurrentSettings({
      zoom: event.target._zoom,
      // TODO: avoid using _renderer & _center
      ...event.target._renderer._center
    });
  };

  return (
    <>
      {isDrawing && (
        <AreaSelector
          x={rectangle.x}
          y={rectangle.y}
          width={rectangle.width}
          height={rectangle.height}
        />
      )}
      <CustomMap
        className="map-component"
        center={initialPosition}
        zoom={initialZoom}
        onzoomend={onMapSettingsUpdate}
        ondragend={onMapSettingsUpdate}
        onclick={onClickMap}
        ref={map}
      >
        {props.areas.map((area, index) => (
          <LeafletRectangle
            key={`rectangle_${index}`}
            bounds={getBoundsFromMapArea(area)}
            {...pathProps}
            onClick={onClickRectangle(area.file)}
          ></LeafletRectangle>
        ))}
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </CustomMap>
    </>
  );
}
