/**
 * Build the map componente based on Leaflet.
 */
var mainMap={
    map:null,// reference to leaflet map component
    mainLayer: null,// reference to main leaflet layer based on geojson raw data.
    defaultZoomLevel:4,// the zoom level used to reset view map
    info:L.control(),
    observer:null,
    selectedFeature:null,

    init:(dataSource)=>{
        mainMap.createMap(dataSource);
    },

    createMap:(dataSource)=>{
        if (mainMap.map) {
            mainMap.map.off();
            mainMap.map.remove();
        }
        mainMap.map = L.map('mainmap').setView([-14, -48], mainMap.defaultZoomLevel);
        mainMap.addBaseLayer(dataSource);
        // mainMap.addInfoControl();
        mainMap.addAttribution();
    },

    // create and add the OSM layer as base layer (background)
    addBaseLayer:(conf)=>{
        L.tileLayer(conf.osm_url+'/{id}/tiles/{z}/{x}/{y}?access_token='+conf.osm_token, {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/light-v9',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(mainMap.map);
    },

    getLegendColor:(value)=>{
        /** 
         * Using the length of the color list from the conf file
         * as the number of classes in the legend
         */
        let len = mainMap.legend.colors.length,
        index = parseInt(value*len);
        index = index>=len ? len-1 : index;
        return mainMap.legend.colors[index];
    },

    style:(feature)=>{
        return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 1,
            fillColor: '#ff0000'
        };
    },

    highlightFeature:()=>{
        let layer = mainMap.selectedFeature;

        layer.setStyle({
            weight: 3,
            color: '#555',
            dashArray: '',
            fillOpacity: 1
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        mainMap.info.update(layer.feature.properties);
    },

    resetHighlight:(e)=>{
        mainMap.mainLayer.resetStyle(e.target);
        mainMap.info.update();
    },

    resetHighlightAll:()=>{
        mainMap.mainLayer.eachLayer(
            (layer)=>{
                if(layer!=mainMap.selectedFeature) {
                    mainMap.mainLayer.resetStyle(layer);
                }
            }
        );
    },

    zoomToFeature:(e)=>{
        mainMap.map.fitBounds(e.target.getBounds());
    },

    onClick:(e)=>{
        mainMap.selectedFeature=e.target;
        mainMap.highlightFeature();
        mainMap.resetHighlightAll();
    },

    onEachFeature:(feature, layer)=>{
        if(mainMap.selectedFeature && feature.properties.gc==mainMap.selectedFeature.feature.properties.gc){
            setTimeout(()=>{
                mainMap.onClick({target:layer});
            },190);
        }
        layer.on({
            click: mainMap.onClick
        });
    },

    fetchData(dataSource){
        fetch(dataSource.url)
        .then(
            (response)=>{
                // on sucess
                response.json()
                .then(
                    (data)=>{
                        mainMap.geojson = data;
                        mainMap.createMainLayer(data);
                        // on sucess
                        if(mainMap.observer) mainMap.observer.next();
                    }
                );
            },
            ()=>{
                // on reject
                console.log("Falhou ao ler o geojson. Mapa incompleto.");
            },
        );
    },

    createMainLayer: (data)=>{
        if(mainMap.mainLayer) mainMap.mainLayer.removeFrom(mainMap.map);
        mainMap.mainLayer = L.geoJson(data, {
            style: mainMap.style,
            onEachFeature: mainMap.onEachFeature
        }).addTo(mainMap.map);
        mainMap.map.bringToFront();
        
        //mainMap.map.fitBounds(mainMap.mainLayer.getBounds());
    },

    addAttribution:()=>{
        mainMap.map.attributionControl.addAttribution('POC of TCC &copy; <a href="https://github.com/Practice-of-PUC-course/">PUC</a>');
    }
};