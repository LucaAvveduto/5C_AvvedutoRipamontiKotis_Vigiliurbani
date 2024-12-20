import { createForm } from "./scripts/form.js";
import { navBarComponent } from "./scripts/navbar.js";
import { createTable } from "./scripts/createTable.js";
import { createMap } from "./scripts/mappe.js";
import { generateFetchComponent } from "./scripts/fetchCache.js";
//import Cookies from "../node_modules/js-cookie/dist/js.cookie.min.js";
let isLogged = Cookies.get('isLogged');

String.prototype.deleteSpace = function () {
    return this.replaceAll(/\s/g, "");
}

function hide(element) {
    element.classList.remove("show");
    element.classList.add("hidden");
}

function show(element) {
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

table.build().then(() => table.renderFiltered("Milano")).catch(console.error);
map.build();

navbar.build("Monitora gli incidenti", "Inserisci");
navbar.render(isLogged);

navbar.callback(() => {
    document.getElementById("form-title").innerText = "Inserisci un nuovo incidente";
    modalElement.classList.remove("hidden");
    modalElement.classList.add("show");
    f.setLabels([
        ["Indirizzo", "text", "Via Luigi Canonica 55"],
        ["Targhe", "text", "AA000AA,BB111BB,CC222CC"],
        ["Data-Ora", "datetime-local", "12/12/2015, 18:00"],
        ["Numero-feriti", "number", "15"],
        ["Numero-morti", "number", "3"]
    ]);
    f.onsubmit((result) => {
        mapElement.innerHTML = "";
        hide(tableElement)
        show(loading);
        console.log(result);
        if (!result) {
            f.send("Errore");
            return false;
        }
        if (result.lenght < 5) {
            f.send("Campi mancanti");
            return false;
        }
        if (result[0] == undefined || result[0].length <= 0) {
            f.send("Indirizzo non valido");
            return false;
        }
        const fetchLocation = generateFetchComponent();
        fetchLocation.build("../../config.json", "location").then(() => {
            fetchLocation.getData((result[0] + ", Milano")).then((address) => {
                if ((result[1].split(",")).length > 2) {
                    f.send("Targa/e non valida/e");; //Targhe
                    return false;
                }
                if (result[2] == "" || result[2] > new Date(Date.now()).toISOString()) {
                    f.send("Data/ora non validi"); //Indirizzo
                    return false;
                }
                if (result[3] < 0) {
                    f.send("Feriti non validi"); //Feriti
                    return false;
                }
                if (result[4] < 0) {
                    f.send("Numero dei morti non validi"); //Morti
                    return false;
                }

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
                            fetchCache.setData(data).then(() => {
                                map.addPlace(("Morti: " + result[4] + ", Feriti: " + result[3] + ", Data e Ora: " + result[2]), [address[0].lat, address[0].lon]).then((i) => {
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
                        } else {
                            f.send("Incidente già esistente"); //Già esistente
                            return false;
                        }
                    }).catch(console.error);
                }).catch(console.error);
            }).catch(console.error);
        }).catch(console.error);
    });
    f.render();
});

navbar.loginButton(() => {
    document.getElementById("form-title").innerText = "Login";
    modalElement.classList.remove("hidden");
    modalElement.classList.add("show");
    f.setLabels([
        ["Username", "text", "Inserire lo username"],
        ["Password", "password", "****"],
    ]);
    f.onsubmit((result) => {
        console.log(result);
        const reg = generateFetchComponent();
        reg.build("../../config.json", "credential").then(() => {
            reg.login(result[0], result[1]).then(() => {
                isLogged = Cookies.get('isLogged');
                const buttons = document.querySelectorAll(".credential");
                buttons.forEach(b => hide(b));
                hide(modalElement);
                show(document.getElementById("open"));
            }).catch(() => f.send("Login failed"));
        }).catch(console.error)
    });
    f.render();
});

navbar.registerCallback(() => {
    document.getElementById("form-title").innerText = "Register";
    modalElement.classList.remove("hidden");
    modalElement.classList.add("show");
    f.setLabels([
        ["Username", "text", "Inserire lo username"],
        ["Password", "password", "****"],
        ["Conferma", "password", "****"]
    ]);
    f.onsubmit((result) => {
        if (result[1] !== result[2]) {
            f.send("Le password non coincidono");
            return false;
        }
        const reg = generateFetchComponent();
        reg.build("../../config.json", "credential").then(() => {
            reg.register(result[0], result[1]).then(() => {
                f.send("Registrato con successo", true);
                reg.login(result[0], result[1]).then(() => {
                    isLogged = Cookies.get('isLogged');
                    const buttons = document.querySelectorAll(".credential");
                    buttons.forEach(b => hide(b));
                    hide(modalElement);
                    show(document.getElementById("open"));
                }).catch(console.error);
            }).catch(err => f.send(err));
        });
    });
    f.render();
});

f.closeRender(() => {
    hide(modalElement);
    map.render();
    table.renderFiltered("Milano")
    hide(loading);
    show(tableElement);
});

table.searchCallback((inputElement) => {
    const inputValue = inputElement.value;
    table.renderFiltered(inputValue).then(console.log).catch(console.error);
    inputElement.value = "";
});