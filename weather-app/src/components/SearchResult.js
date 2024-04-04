import React from 'react';
import './SearchResult.css';

export const SearchResult = ({ result, setLat, setLong, setLocation, recent, setRecent, ...props }) => {
    
    function setLatLong() {
        setLat(result.latitude);
        setLong(result.longitude);
        setLocation(result.name);
        setRecent([...recent, {name: result.name, lat: result.latitude, long: result.longitude}])
    }

    return (
        <div className="search-result" onClick={()=>setLatLong()}>{result.name}</div>
    );
}

export default SearchResult;