import {
    createForm
} from "./scripts/form.js";
import {
    navBarComponent
} from "./scripts/navbar.js";
import {
    createTable
} from "./scripts/createTable.js";
import {
    createMap
} from "./scripts/mappe.js";
import {
    generateFetchComponent
} from "./scripts/fetchCache.js";

String.prototype.deleteSpace = function () {
    return this.replaceAll(/\s/g, "");
}

function hide (element) {
    element.classList.remove("show");
    element.classList.add("hidden");
}

function show (element) {
    element.classList.remove("hidden");
    element.classList.add("show");
}

const formElement = document.getElementById("form");
const navbarElement = document.getElementById("nav-bar");
const modalElement = document.getElementById("md");
const tableElement = document.getElementById("tableList")
const map = createMap(document.getElementById("map"));
const loading = document.getElementById("loading");
const mapElement = document.getElementById("map");

const f = createForm(formElement);
const navbar = navBarComponent(navbarElement);
const table = createTable(tableElement);


f.setLabels([
    ["Indirizzo", "text", "Via Luigi Canonica 55"],
    ["Targhe", "text", "AA000AA,BB111BB,CC222CC"],
    ["Data-Ora", "datetime-local", "12/12/2015, 18:00"],
    ["Numero-feriti", "number", "15"],
    ["Numero-morti", "number", "3"]
]);

table.build().then(() => table.renderFiltered("Milano")).catch(console.error)

map.build();
navbar.callback(() => {
    console.log("premuto");
    modalElement.classList.remove("hidden");
    modalElement.classList.add("show");
    f.render();
});

navbar.build("Monitora gli incidenti", "Inserisci");
navbar.render();

f.onsubmit((result) => {
    mapElement.innerHTML = "";
    hide(tableElement)
    show(loading);
    console.log(result);
    if (!result) return false;
    if (result.lenght < 5) return false;
    if (result[0] == undefined || result[0].length <= 0) return false; //Indirizzo

    const fetchLocation = generateFetchComponent();
    fetchLocation.build("../../config.json", "location").then(() => {
        fetchLocation.getData((result[0] + ", Milano")).then((address) => {
            if (result[1].split(",").lenght > 3) return false; //Targhe
            if (result[2] == "" || result[2] > new Date(Date.now()).toISOString()) return false; //DataOra
            if (result[3] < 0) return false; //Feriti
            if (result[4] < 0) return false; //Morti

            const res = {
                address: address[0],
                targhe: result[1],
                morti: result[4],
                feriti: result[3],
                dataora: new Date(result[2]).toUTCString()
            }

            const fetchCache = generateFetchComponent();
            fetchCache.build("../../config.json", "cache").then(() => {

                const key = result[0].deleteSpace() + ",Milano_" + result[2];
                console.log(key);
                fetchCache.getPostData().then(d => {
                    let data = JSON.parse(d);
                    if (!data[key]) {
                        data[key] = res;
                        fetchCache.setData(data).then(()=>{
                            map.addPlace(("Morti: " + result[4] + ", Feriti: "+result[3]+", Data e Ora: "+result[2]), [address[0].lat, address[0].lon]).then((i) => {
                                map.render(i);
                                table.renderFiltered("Milano")
                                hide(loading)
                                show(tableElement);
                            }).catch((i) => {
                                map.render(i);
                                table.renderFiltered("Milano")
                                hide(loading)
                                show(tableElement);
                            });
                        }).catch(console.error);
                        modalElement.classList.remove("show");
                        modalElement.classList.add("hidden");
                    } else return false; //Già esistente
                }).catch(console.error);
            }).catch(console.error);
        }).catch(console.error);
    }).catch(console.error);
});
table.searchCallback((inputElement)=>{
    const inputValue = inputElement.value;
    table.renderFiltered(inputValue).then(console.log).catch(console.error);
    inputElement.value = "";
});