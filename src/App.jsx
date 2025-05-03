// src/App.jsx
import React, { useEffect, useState } from "react";
import Map from "./components/Map";
import { geocodeAddress } from "./utils/geocode";

const App = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_GAS_ENDPOINT);
      const data = await response.json();

      // 各住所に対して緯度・経度を取得
      const enriched = await Promise.all(
        data.map(async (item) => {
          const { lat, lng } = await geocodeAddress(item.address);
          return {
            ...item,
            lat,
            lng,
          };
        })
      );

      setLocations(enriched);
    } catch (error) {
      console.error("データ取得またはジオコーディング中にエラー:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">おすすめ店舗マップ</h1>
      {loading ? (
        <p>地図を読み込んでいます...</p>
      ) : (
        <Map locations={locations} />
      )}
    </div>
  );
};

export default App;