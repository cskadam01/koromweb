import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 47.53693080152924, // Budapest koordinátái (változtasd meg szükség szerint)
  lng: 19.20307695865631,
};

const Terkep = () => {
  return (
    <div className="terkep">
    <strong >Helyszín: Timur utca 103 1162 <a href="https://www.oxyfitt.eu" target="blank" style={{color:'Green'}}> OxyFitt</a></strong>
    <LoadScript googleMapsApiKey="AIzaSyCjNFZKLC8BM-aPsQ8nwy1axS5kjewOoEM">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>

        
    
    </div>
  );
};

export default Terkep;
