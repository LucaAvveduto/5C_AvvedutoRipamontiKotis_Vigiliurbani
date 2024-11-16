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
const loading = document.getElementById("loading");

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

table.build().then(() => table.render()).catch(console.error)

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
                        map.addPlace((result[0] + ", Milano"), address[0]).then((i) => {
                            map.render(i);
                            loading.classList.add("hidden");
                             //indirizzo da inserire
                        }).catch((i) => {
                            map.render(i);
                            loading.classList.add("hidden");
                        });
                        modalElement.classList.remove("show");
                        modalElement.classList.add("hidden");
                    } else return false; //Già esistente
                }).catch(console.error);
            }).catch(console.error);

        }).catch(console.error);
    }).catch(console.error);
    loading.classList.add("show");
    loading.innerHTML =
    `<div class="flex-col gap-4 w-full flex items-center justify-center">
  <div class="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="animate-ping">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"></path>
    </svg>
  </div>
</div>`;
});
table.searchCallback((inputElement)=>{
    const inputValue = inputElement.value;
    table.render(inputValue);
    inputElement.value = "";
});