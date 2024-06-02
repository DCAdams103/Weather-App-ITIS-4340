import React, {useEffect, useRef, useState} from 'react';
import {Map, LayersControl, TileLayer, Marker, Popup} from "react-windy-leaflet";

const ReportMap = ({lat, long}) => {

    const [state, setState] = useState({
        zoom: 10,

        // pickerOpen: true,
        // pickerLat: lat,
        // pickerLng: long,

        overlay: "wind"
    });
    const position = [lat, long];
    const { BaseLayer, Overlay } = LayersControl;

    useEffect(() => {
        // let interval = setInterval(() => {
        //     setState(s => ({
        //         ...s,
        //         pickerLat: state.pickerLat + 1,
        //         pickerLng: state.pickerLng + 1
        //     }));
        // }, 1000);

        // setTimeout(() => {
        //     clearInterval(interval);
        //     setState(s => ({...s, pickerOpen: false}));
        // }, 6000);

        // setTimeout(() => {
        //     setState(s => ({...s, pickerOpen: true, pickerLat: 25, pickerLng: 40}));
        // }, 7000);
    }, [])

    return (
        <div>

            <Map
                className="leaflet-container"
                style={{width: "80%", height: "80vh", marginLeft: "12%", marginTop: "2%" }}
                windyKey={"kJAxUB7Zz06BfvmA4GKdld2BpFp4D4ds"}
                windyLabels={true}
                windyControls={false}
                overlay={state.overlay}
                overlayOpacity={1}
                particlesAnim={true}
                zoom={state.zoom}
                center={[lat, long]}
                
                onWindyMapReady={() => {
                    console.log("Windy Map Loaded!");
                }}
                mapElements={
                    <React.Fragment>
                        <LayersControl>
                            <BaseLayer checked name="OSM">
                                <TileLayer
                                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </BaseLayer>
                        </LayersControl>

                        <Marker position={position}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </React.Fragment>
                }
            />
        </div>
    );
};

export default ReportMap;