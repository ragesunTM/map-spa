// components/Map.js

import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { geocodeAddress } from "../utils/geocode";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 35.681236, // 東京駅付近
  lng: 139.767125,
};

export default function Map({ shops }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    async function fetchGeocodes() {
      const results = await Promise.all(
        shops.map(async (shop) => {
          const coords = await geocodeAddress(shop.address);
          return coords
            ? { ...shop, lat: coords.lat, lng: coords.lng }
            : null;
        })
      );
      setLocations(results.filter((loc) => loc !== null));
    }

    fetchGeocodes();
  }, [shops]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {locations.map((shop, index) => (
        <Marker key={index} position={{ lat: shop.lat, lng: shop.lng }} />
      ))}
    </GoogleMap>
  );
}
