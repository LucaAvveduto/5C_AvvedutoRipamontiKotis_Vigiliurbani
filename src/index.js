import { createForm } from "./scripts/form.js";
import { navBarComponent } from "./scripts/navbar.js";

const form = document.getElementById("form");
const navbarElement = document.getElementById("nav-bar");
const modalElement = document.getElementById("md");

const f = createForm(form);
f.setLabels(["x","y"]);
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