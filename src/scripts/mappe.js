import { generateFetchComponent } from "./fetchCache.js";

export function createMap(parentElement) {
    const zoom = 12;
    const maxZoom = 19;
    const places = new Array();
    let map;

    return {
        build: () => {
            return new Promise((resolve, reject) => {
                const fetchCache = generateFetchComponent();
                fetchCache.build("../../config.json","cache").then(()=>{
                    fetchCache.getPostData().then((d)=>{
                        let data = JSON.parse(d);
                        if(map) map.remove();
                        map = L.map(parentElement).setView([45.4639102, 9.1906426], zoom);
                        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: maxZoom,
                            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }).addTo(map);
                        for(const key in data){
                            places.push({name: ("Morti: " + data[key].morti + ", Feriti: "+data[key].feriti+", Data e Ora: "+new Date(data[key].dataora).toUTCString()), coords: [data[key].address.lat, data[key].address.lon]});
                            const marker = L.marker([data[key].address.lat, data[key].address.lon]).addTo(map);
                            marker.bindPopup("<b>" + ("Morti: " + data[key].morti + ", Feriti: "+data[key].feriti+", Data e Ora: "+new Date(data[key].dataora).toUTCString()) + "</b>");
                        }
                        resolve("build map done");
                    }).catch(reject);
                }).catch(reject);
            })
        },
        render: (index) => {
            if(!index) index = 0;
            if(map) map.remove();
            map = L.map(parentElement).setView(places[index].coords, zoom);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: maxZoom,
                attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            places.forEach((place) => {
                const marker = L.marker(place.coords).addTo(map);
                marker.bindPopup("<b>" + place.name + "</b>");
            });
        },
        addPlace: (name, coords) => {
            console.log(places);
            return new Promise((resolve, reject) => {
                if (places.some(place => place.name === name)) {
                    return reject(places.length - 1);
                }
                places.push({
                    name: name,
                    coords: coords
                });
                resolve(places.length - 1);
            })

        }
    }
}