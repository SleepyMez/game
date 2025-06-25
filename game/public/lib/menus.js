import { mixColors } from "./canvas.js";
import { options } from "./util.js";

export function showMenu(menuID) {
    document.getElementById(menuID).classList.add("active");
}

const topButtons = document.getElementById("topButtons");
const menuContainer = document.getElementById("menus");

const menuColors = [
    "#C8C8C8",
    "#88C8BA",
    "#C8BA88",
    "#7289DA",
    "#C88888"
];

const closeButton = topButtons.querySelector("#closeButton");
for (let i = 0; i < 5; i++) {
    const child = topButtons.children.item(i);

    child.style.backgroundColor = menuColors[i % menuColors.length];
    child.style.borderColor = mixColors(menuColors[i % menuColors.length], "#000000", .2);

    const image = new Image();
    image.src = "./assets/" + child.id + ".svg";
    image.onload = function () {
        child.appendChild(image);
    }

    if (i === 4) {
        child.onclick = function () {
            for (let j = 0; j < menuContainer.children.length; j++) {
                menuContainer.children.item(j).classList.remove("active");
            }

            closeButton.classList.add("inactive");
        }
    } else if (i === 3) {
        child.onclick = function () {
            window.open("https://discord.gg/floof-1068705909607501914");
        }
    } else {
        const menu = menuContainer.children.item(i);
        menu.style.backgroundColor = menuColors[i % menuColors.length];
        menu.style.borderColor = mixColors(menuColors[i % menuColors.length], "#000000", .2);

        child.onclick = function () {
            if (menu.classList.contains("active")) {
                for (let j = 0; j < menuContainer.children.length; j++) {
                    menuContainer.children.item(j).classList.remove("active");
                }

                closeButton.classList.add("inactive");
                return;
            }


            for (let j = 0; j < menuContainer.children.length; j++) {
                menuContainer.children.item(j).classList.remove("active");
            }

            menu.classList.toggle("active");
            closeButton.classList.remove("inactive");
        }
    }
}

export function showMenus() {
    document.getElementById("menuContainer").classList.add("active");
}

export function hideMenus() {
    document.getElementById("menuContainer").classList.remove("active");
    for (let j = 0; j < menuContainer.children.length; j++) {
        menuContainer.children.item(j).classList.remove("active");
    }
}

function bindOptionToggle(option, elementID) {
    const element = document.getElementById(elementID); // checkbox

    element.onchange = function () {
        options[option] = element.checked;
        localStorage.setItem("options-" + option, element.checked);
    }

    element.checked = options[option];
    if (localStorage.getItem("options-" + option) === "true") {
        element.checked = true;
        options[option] = true;
    }
}

bindOptionToggle("showDebug", "show-debug");
bindOptionToggle("hideGrid", "hide-grid");
bindOptionToggle("rigidInterpolation", "rigid-interpolation");
bindOptionToggle("mouseMovement", "mouse-movement");
bindOptionToggle("hideEntityUI", "hide-entity-ui");
bindOptionToggle("useTileBackground", "use-tile-background");
bindOptionToggle("fancyGraphics", "extra-graphics");
bindOptionToggle("showHitboxes", "show-hitboxes");

export async function loadAndRenderChangelogs() {
    const changelogs = [];

    try {
        const data = await (await fetch("./assets/changelog.md")).text();
        changelogs.push(...data.split("\n"));
    } catch (e) {
        return false;
    }

    const latestChangelog = changelogs[0];
    if (localStorage.getItem("latestChangelog") !== latestChangelog) {
        const button = document.querySelector("button#changelogMenu");
        const img = new Image();
        img.src = "./assets/alert.svg";
        img.classList.add("alert");
        button.appendChild(img);

        button.addEventListener("click", () => {
            button.removeChild(img);
            localStorage.setItem("latestChangelog", latestChangelog);
        });
    }

    const container = document.querySelector(".menu#changelogMenu");
    while (changelogs.length) {
        const line = changelogs.shift();
        if (!line.startsWith("#")) {
            console.warn("Invalid first line of block:", line);
            return false;
        }

        const h = document.createElement("span");
        h.textContent = line.slice(2);
        container.appendChild(h);

        const cc = document.createElement("ul");

        while (true) {
            const subLine = changelogs.shift();

            if (!subLine || !subLine.startsWith("-")) {
                container.appendChild(document.createElement("br"));
                break;
            }

            const l = document.createElement("li");
            l.textContent = subLine.slice(2);
            l.style.fontWeight = "normal";
            cc.appendChild(l);
        }

        container.appendChild(cc);
    }

    return true;
}
