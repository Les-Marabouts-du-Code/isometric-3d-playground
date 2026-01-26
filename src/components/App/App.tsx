import React, { useState } from 'react';
import './App.scss';
import styled from 'styled-components';
import { Link, Redirect, Route, useHistory } from 'react-router-dom';
import Visualizator from '../Visualizator/Visualizator';
import MapMenu, { Props as MapMenuProps } from '../MapMenu/MapMenu';
import config from '../../config/infos.json';
import { LoadJSON } from '../../data/LoadJSON';
import fetchAreaElevation from '../../data/fetchAreaElevations';

const ButtonToIsometric = styled.button`
  top: 1em;
  right: 1em;
`;
const ButtonToMapSelector = styled.button`
  top: 1em;
  left: 1em;
`;

const pathToFiles = './data/';

const ROUTES = {
  ROOT: '/',
  MAP: '/map',
  ISOMETRIC: '/isometric'
};

type Props = {};

export default function App(props: Props) {
  const [mapData, setMapData] = useState<JSON>();
  const history = useHistory();

  const handleMapMenuClick = (file: string) => {
    const loadJSON = new LoadJSON(pathToFiles + file);
    loadJSON.load(onLoadComplete, onLoadError);
  };

  const onLoadError = (message: string) => {};

  const onLoadComplete = (data: JSON) => {
    setMapData((prev) => {
      if (prev !== data) {
        return data;
      }
    });
    history.push(ROUTES.ISOMETRIC);
  };

  const handleMapMenuSelectArea = (
    // NOTE: type declaration here is mostly for shits & giggles
    params: Parameters<Required<MapMenuProps>['onSelectArea']>[0]
  ) => {
    //
    fetchAreaElevation({
      latitude: params.areaCoordinates.latitude,
      longitude: params.areaCoordinates.longitude,
      width: params.areaCoordinates.width,
      height: params.areaCoordinates.height,
      // TEMP: again this one is weird
      longitudeSteps: params.areaCoordinates.longitudeSteps
    })
      .then((data) => {
        localStorage.setItem('mapFetchedData', JSON.stringify(data));
        history.push(ROUTES.ISOMETRIC);
        console.log({ data });
      })
      .catch((error: Error) => {
        console.log(`Error fetching data: ${error.message}`);
        //this.fetchDataError(error.message);
      });
  };

  return (
    <>
      <Route exact path={ROUTES.ROOT}>
        <Redirect to={ROUTES.MAP} />
      </Route>
      <Route exact path={ROUTES.MAP}>
        <Link to={ROUTES.ISOMETRIC}>
          <ButtonToIsometric className="switch-view">
            Isometric 3d View &gt;
          </ButtonToIsometric>
        </Link>
        <MapMenu
          areas={config}
          onClickArea={handleMapMenuClick}
          onSelectArea={handleMapMenuSelectArea}
        ></MapMenu>
      </Route>
      <Route exact path={ROUTES.ISOMETRIC}>
        <Link to={ROUTES.MAP}>
          <ButtonToMapSelector className="switch-view inverted">
            &lt; Map
          </ButtonToMapSelector>
        </Link>
        <IfVisualizator data={mapData}></IfVisualizator>
      </Route>
    </>
  );
}

const IfVisualizator = (props: { data?: JSON }) => {
  // TEMP
  const storedDataRaw = localStorage.getItem('mapFetchedData') || '';
  let dataToRender;
  try {
    dataToRender = JSON.parse(storedDataRaw);
  } catch (error) {
    dataToRender = props.data;
  }
  const imageData = localStorage.getItem('mapImage') || undefined;
  console.log({ imageData, dataToRender });

  if (dataToRender) {
    return <Visualizator mapData={dataToRender} imageData={imageData} />;
  } else {
    return null;
  }
};
