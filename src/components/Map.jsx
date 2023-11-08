import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import "./Map.css";

const Map = () => {
  const apiKey = "AIzaSyBFror_Ln-VZWN0gQLK_AfwXaibys_P3dg"

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });
  const center = useMemo(() => ({ lat: 30.2672, lng: 97.7431 }), []);
  return (
    <div className="App">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={10}
        />
      )}
    </div>
  );
};

export default Map