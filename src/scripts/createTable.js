import { generateFetchComponent } from "./fetchCache.js"

export const createTable = (parentElement) => {
    let fetchComp;
    let searchCallback=null;

    return {
        render: (filter) => {
            return new Promise((resolve, reject) => {
                return fetchComp.getPostData().then((d) => {
                    let data = JSON.parse(d);
                    let listToShow = data;
                    let html = `
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div class="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                        <div></div>
                        <label for="table-search" class="sr-only">Search</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                            </div>
                            <input type="text" id="table-search" class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items">
                            <button id="search-table" type="button" class="absolute inset-y-0 right-0 px-4 py-2 text-white bg-purple-700 border border-transparent rounded-lg hover:bg-purple-800 focus:outline-none dark:bg-purple-600 dark:hover:bg-purple-700">Search</button>
                        </div>                                                                    
                    </div>
                
                
                    <div id="tab">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="stick-on-top text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Indirizzo
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Targhe
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Morti
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Feriti
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Data/Ora
                                </th>
                            </tr>
                        </thead>
                        <tbody>`;
                    if (filter) {
                        listToShow = data.filter(e => e.address === filter);
                    }
                    for (const element in listToShow) {
                        html += `
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">`
                                  +  listToShow[element].address.display_name+
                                `</th>
                                <td class="px-6 py-4">`
                                    +listToShow[element].targhe+
                                `</td>
                                <td class="px-6 py-4">`
                                    +listToShow[element].morti+
                                `</td>
                                <td class="px-6 py-4">`
                                  +listToShow[element].feriti+
                                `</td>
                                <td class="px-6 py-4">`
                                  + new Date(listToShow[element].dataora).toUTCString() +
                                `</td>
                            </tr>`
                        };

                    html += `
                        </tbody>
                    </table>
                </div>
            </div>
                `;
                    parentElement.innerHTML = html; 
                    document.getElementById("search-table").onclick = () => searchCallback(document.getElementById("table-search"));
                    return resolve(html);
                }).catch(reject)
            });
        },

        build: () => {
            return new Promise((resolve, reject) => {
                fetchComp = generateFetchComponent();
                fetchComp.build("../../config.json", "cache").then(resolve).catch(reject)
            });
        },
        searchCallback: (callback) =>{
            searchCallback = callback;
        }
    };
};