import { createForm } from "./scripts/form.js";
import { navBarComponent } from "./scripts/navbar.js";
import { createTable } from "./scripts/createTable.js";

const form = document.getElementById("form");
const navbarElement = document.getElementById("nav-bar");
const modalElement = document.getElementById("md");

const f = createForm(form);
f.setLabels([
    ["Indirizzo","text","Via Luigi Canonica 55"],
    ["Targhe","text","AA000AA,BB111BB,CC222CC"],
    ["Data-Ora","datetime-local","12/12/2015, 18:00"],
    ["Numero-feriti","number","15"],
    ["Numero-morti","number","3"]
]);
f.onsubmit(console.log);
f.render();

const navbar = navBarComponent(navbarElement);
navbar.callback(() => {
    console.log("premuto");
    modalElement.classList.remove("hidden");
    modalElement.classList.add("show");
});
navbar.build("Monitora gli incidenti", "crea");
navbar.render();

const table = createTable(document.getElementById("tableList"));
table.build().then(()=>{
    table.render();
})
