/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {EquicordDevs, sleep} from "@utils/index";
import definePlugin from "@utils/types";

import { settings } from "./settings";
export default definePlugin({
    name: "Maxwell :3",
    description: "Silly Silly Silly",
    authors: [EquicordDevs.Antipollyanna],
    dependencies: ["CommandsAPI"],
    settings,
    async start() {
        await sleep(5);
        for (let i = 0; i < settings.store.concurrentMaxwells ; i +=1) {
            addGifToScreen();
        }

    },
    stop() {
        let gifElement = document.querySelector(".moving-gif");
        while (gifElement) {
            if (gifElement) {
                gifElement.remove();
            }
            gifElement = document.querySelector(".moving-gif");
        }

    }


});

export async function addGifToScreen() {
    // Make Maxwell happy spot :3
    const gifElement = document.createElement("img");
    gifElement.src = settings.store.gifLink2; // Start with spinny car
    gifElement.className = "moving-gif";
    gifElement.style.position = "fixed";
    gifElement.style.bottom = "10px";
    gifElement.style.left = "0px";
    gifElement.style.width = settings.store.gifSize + "px";
    gifElement.style.zIndex = "9999";
    gifElement.style.transition = "all ease";
    // Maxwell approves of directly modifying the DOM
    document.body.appendChild(gifElement);

    const getRandTime = (min: number, max: number) => Math.random() * (max - min) + min;

    // Where will Maxwell be silly next?
    const getRandPos = () => {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const gifW = gifElement.offsetWidth;
        const gifH = gifElement.offsetHeight;

        return {
            x: Math.max(0, Math.random() * (screenW - gifW)),
            y: Math.max(0, Math.random() * (screenH - gifH))
        };
    };

    const timeToGetReallySilly = async () => {
        while (true) {
            // spinny spinny spinny spinny spinny spinny spinny
            gifElement.src = settings.store.gifLink2;
            gifElement.style.transition = "none";
            await new Promise(resolve => setTimeout(resolve, getRandTime(4000, 8000)));

            // dancy dancy dancy dancy dancy dancy dancy
            const { x, y } = getRandPos();
            gifElement.src = settings.store.gifLink1;
            gifElement.style.transition = `all ${getRandTime(4, 8)}s ease`;
            gifElement.style.left = `${x}px`;
            gifElement.style.bottom = `${y}px`;

            await new Promise(resolve => {
                gifElement.addEventListener("transitionend", resolve, { once: true });
            });
        }
    };

    timeToGetReallySilly();
}
