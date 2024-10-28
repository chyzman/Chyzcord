/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DataStore } from "@api/index";
import { ChyzcordDevs } from "@utils/constants";
import definePlugin from "@utils/types";
import {User} from "discord-types/general/index.js";

const storageLocation = "USERMODIFICATIONS";

let userModifications = new Map<string, String>();

export default definePlugin({
    name: "LocalEdit",
    description: "locally modify stuff",
    authors: [ChyzcordDevs.chyzman],
    async start() {
        const savedUserModifications = await DataStore.get(storageLocation);
        if (savedUserModifications) {
            if (typeof savedUserModifications === "string") {
                userModifications = new Map(JSON.parse(savedUserModifications));
            } else {
                userModifications = new Map(savedUserModifications);
            }
        }
    },
    patches: [
        {
            find: "getUser:",
            replacement: {
                match: /(getUser:)(\i),/,
                replace: "$self.getModifiedUser($1),"
            }
        }
    ],
    getModifiedUser: (user: User) => {
        console.log(user);
        user.bio = "test";
        return user;
    }
});
