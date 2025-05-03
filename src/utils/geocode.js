// utils/geocode.js

export async function geocodeAddress(address) {
    const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(address)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.length > 0) {
        const [lng, lat] = data[0].geometry.coordinates;
        return { lat, lng };
      } else {
        throw new Error("住所が見つかりませんでした");
      }
    } catch (error) {
      console.error("ジオコーディングエラー:", error);
      return null;
    }
  }
  