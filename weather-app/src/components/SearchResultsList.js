import React from 'react';
import SearchResult from './SearchResult'; 

import './SearchResultsList.css';

export const SearchResultsList = ({ results, lat, long, location, recent, setRecent }) => {
   
    if (!Array.isArray(results)) {
        return null; // 
    }
    
    return (
        <div className="results-list">
            {results.map((result, id) => {
                return <SearchResult result={result} key={id} setLat={lat} setLong={long} setLocation={location} recent={recent} setRecent={setRecent} />;
            })}
        </div>
    );
};