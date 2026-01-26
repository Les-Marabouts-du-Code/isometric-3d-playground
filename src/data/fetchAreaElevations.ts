interface MapCoordinates {
  latitude: number;
  longitude: number;
}

interface ElevationPoint extends MapCoordinates {
  elevation: number;
}

interface AreaElevationResults {
  infos: {
    latitude: number;
    longitude: number;
    width: number;
    height: number;
    longitudeSteps: number;
  };
  results: ElevationPoint[];
}

const MAX_COORDINATES_BY_REQUEST = 5;

export default async function fetchAreaElevation(params: {
  latitude: number;
  longitude: number;
  width: number;
  height: number;
  longitudeSteps: number;
}): Promise<AreaElevationResults> {
  console.log(`fetchAreaElevation`, params);
  // TODO: validate props (correct latitude/longitude & steps)

  const latitudeSteps = Math.round(
    (params.height / params.width) * params.longitudeSteps
  );
  const totalSteps = params.longitudeSteps * latitudeSteps;
  let data: ElevationPoint[] = [];

  // TODO: get multiple points' elevations (e.g. 10)
  const getSingleData = async (locations: MapCoordinates[]) => {
    const singleData = await fetch(
      // `http://localhost:8080/api/v1/lookup?locations=${lat},${lng}`
      `http://localhost:8080/api/v1/lookup?locations=${locations
        .map((location) => `${location.latitude},${location.longitude}`)
        .join('|')}`
    );
    const singleDataJSON: {
      results: ElevationPoint[];
    } = await singleData.json();
    return singleDataJSON.results;
  };

  let coordinatesForRequests: MapCoordinates[] = [];

  // TODO: construct an array of arrays (MapCoordinates[][]), then make a request for each entry
  for (let i = 0; i < totalSteps; i++) {
    // TODO: here we will get elevations from the subdivisions' top-left corners ; but it could be done some other way
    const lng =
      params.longitude +
      (i % params.longitudeSteps) * (params.width / params.longitudeSteps);
    const lat =
      params.latitude -
      Math.floor(i / params.longitudeSteps) * (params.height / latitudeSteps);

    const singleCoordinates: MapCoordinates = {
      latitude: lat,
      longitude: lng
    };

    coordinatesForRequests.push(singleCoordinates);

    if (coordinatesForRequests.length === MAX_COORDINATES_BY_REQUEST) {
      const singleDataJSON = await getSingleData(coordinatesForRequests);
      data = data.concat(singleDataJSON);
      coordinatesForRequests = [];
    }

    // const singleDataJSON = await getSingleData(lat, lng);
    // data.push(singleDataJSON);
  }

  console.log({ data });

  // const rawData = await fetch(
  //   `http://localhost:8080/api/v1/lookup?locations=${coordinatesURLParameters.join(
  //     '|'
  //   )}`,
  //   { mode: 'cors', headers: {
  //     'Content-Type': 'application/json'
  //   } }
  // );

  return {
    // FIXME
    infos: params,
    results: data
  };
}
