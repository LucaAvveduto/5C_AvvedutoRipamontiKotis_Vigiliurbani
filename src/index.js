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

const formElement = document.getElementById("form");
const navbarElement = document.getElementById("nav-bar");
const modalElement = document.getElementById("md");
const tableElement = document.getElementById("tableList")
const map = createMap(document.getElementById("map"));

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

table.buildTable().then(() => {
    //table.render();
})

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
                dataora: result[2]
            }

            const fetchCache = generateFetchComponent();
            fetchCache.build("../../config.json", "cache").then(() => {

                const key = result[0].deleteSpace() + ",Milano_" + result[2];
                console.log(key);
                fetchCache.getPostData().then(d => {
                    let data = JSON.parse(d);
                    if (!data[key]) {
                        data[key] = res;
                        fetchCache.setData(data).then(console.log).catch(console.error);
                        map.addPlace((result[0] + ", Milano"), address[0]).then((i) => map.render(i)).catch((i) => map.render(i));
                        modalElement.classList.remove("show");
                        modalElement.classList.add("hidden");
                    } else return false; //Già esistente
                }).catch(console.error);
            }).catch(console.error);

        }).catch(console.error);
    });
});