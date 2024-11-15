export const createForm = (parentElement) =>{
    let data = [];
    let callback = null;
    return {  
      setLabels: (labels) => { data = labels; },  
      onsubmit: (callbackInput) => { callback = callbackInput},
      render: () => { 
        parentElement.innerHTML = 
          data.map((name) => {
              return `<form class="max-w-md mx-auto">
                        <div class="relative z-0 w-full mb-5 group">
                            <label for="` + name[0] + `" class="block mb-2 text-sm font-medium text-purple-300 dark:text-gray">` + name[0] + `</label>
                            <input type="` + name[1] + `" id="` + name[0] + `"class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="` + name[2] + `" required />
                        </div>`
                ;
            }).join('\n')
            + "<button type='button' class='text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' id='submit'>INVIA</button>"
            + "<button type='button' class='text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cl' id='cancel'>ANNULLA</button>";  
            ;  
        document.querySelector("#submit").onclick = () => {
          const result = data.map((name) => {
            return document.querySelector("#" + name[0]).value;
          });
          data.forEach((element) => {
            const node = document.querySelector("#" + element[0])
            const type = element[1];
            node.value = type !== "text" ? "gg/mm/aaaa, --:--" : "";
          });
          callback(result);
        }
        document.querySelectorAll(".cl").forEach((e) =>
          e.onclick = () => {
            const modal = document.getElementById("md");
            modal.classList.remove("show");
            modal.classList.add("hidden");
        });         
      },
    };
  };