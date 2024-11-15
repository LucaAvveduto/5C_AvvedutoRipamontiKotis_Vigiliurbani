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
                            <input type="text" id="` + name + `"class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                            <label for="` + name + `" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">` + name + `</label>
                        </div>`
                ;
            }).join('\n')
            + "<button type='button' class='text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' id='submit'>INVIA</button>"
            + "<button type='button' class='text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cl' id='cancel'>ANNULLA</button>";  
            ;  
        document.querySelector("#submit").onclick = () => {
          const result = data.map((name) => {
            return document.querySelector("#" + name).value;
          });
          data.forEach((element) => {
            document.querySelector("#" + element).value = "";
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