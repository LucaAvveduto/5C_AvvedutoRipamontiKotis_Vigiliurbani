export function navBarComponent(parentElement) {
    let callback;
    let loginCallback;
    let registerCallback;
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
                                    <button class="hidden rounded-full bg-gray-700 p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 nav-btn" id="open">` + buttons +`</button>
                                    <button class="rounded-full bg-gray-700 p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 nav-btn credential" id="login">Login</button>
                                    <button class="rounded-full bg-gray-700 p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 nav-btn credential" id="register">Register</button>
                                </div>
                                </div>
                            </div>`;
            parentElement.innerHTML = newNavBar;

            document.querySelector("#open").onclick = () => callback();
            document.querySelector("#login").onclick = () => loginCallback();
            document.querySelector("#register").onclick = () => registerCallback();
        },
        callback(value){
            callback = value;
        },
        loginButton(value) {
            loginCallback = value;
        },
        registerCallback(value) {
            registerCallback = value;
        }
    }
}