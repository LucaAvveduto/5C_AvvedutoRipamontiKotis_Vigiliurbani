export function navBarComponent(parentElement) {
    let callback;
    let title;
    let buttons;

    return {
        build: (tit,btn) => {
            title = tit;
            buttons = btn;
        },
        render: () => {
            if(!title || !buttons) return false;
            let newNavBar = `<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                                <div class="relative flex h-16 items-center justify-between">
                                
                                <div class="flex items-center">
                                    <div class="flex space-x-4">`

            newNavBar += "<h1 class='nav-title'>"+ title +"</h1>";
            newNavBar += `</div>
                                </div>
                                <div class="flex items-center">
                                    <button class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white" id="open">` + buttons +`</button>
                                </div>
                                </div>
                            </div>`;
            parentElement.innerHTML = newNavBar;

            document.querySelector("#open").onclick = () => callback();
        },
        callback(value){
            callback = value;
        }
    }
}