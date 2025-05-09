/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandOptionType, sendBotMessage } from "@api/Commands";
import { ApplicationCommandInputType } from "@api/Commands/types";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    resultsAmount: {
        type: OptionType.NUMBER,
        description: "The amount of results you want to get (more gives better results, but is slower)",
        default: 10
    }
});

export default definePlugin({
    name: "UrbanDictionary",
    description: "Search for a word on Urban Dictionary via /urban slash command",
    authors: [Devs.jewdev],
    dependencies: ["CommandsAPI"],
    settings,
    commands: [
        {
            name: "urban",
            description: "Returns the definition of a word from Urban Dictionary",
            inputType: ApplicationCommandInputType.BUILT_IN,
            options: [
                {
                    type: ApplicationCommandOptionType.STRING,
                    name: "word",
                    description: "The word to search for on Urban Dictionary",
                    required: true
                }
            ],
            execute: async (args, ctx) => {
                try {
                    const query: string = encodeURIComponent(args[0].value);
                    const { list } = await fetch(`https://api.urbandictionary.com/v0/define?term=${query}&per_page=${settings.store.resultsAmount}`).then(response => response.json());

                    if (!list.length)
                        return void sendBotMessage(ctx.channel.id, { content: "No results found." });

                    const definition = list.reduce((prev, curr) => {
                        return prev.thumbs_up > curr.thumbs_up ? prev : curr;
                    });

                    const linkify = (text: string) => text
                        .replaceAll("\r\n", "\n")
                        .replace(/([*>_`~\\])/gsi, "\\$1")
                        .replace(/\[(.+?)\]/g, (_, word) => `[${word}](https://www.urbandictionary.com/define.php?term=${encodeURIComponent(word)} "Define '${word}' on Urban Dictionary")`)
                        .trim();

                    return void sendBotMessage(ctx.channel.id, {
                        embeds: [
                            {
                                type: "rich",
                                author: {
                                    name: `Uploaded by "${definition.author}"`,
                                    url: `https://www.urbandictionary.com/author.php?author=${encodeURIComponent(definition.author)}`,
                                },
                                title: definition.word,
                                url: `https://www.urbandictionary.com/define.php?term=${encodeURIComponent(definition.word)}`,
                                description: linkify(definition.definition),
                                fields: [
                                    {
                                        name: "Example",
                                        value: linkify(definition.example),
                                    },
                                    {
                                        name: "Want more definitions?",
                                        value: `Check out [more definitions](https://www.urbandictionary.com/define.php?term=${query} "Define "${args[0].value}" on Urban Dictionary") on Urban Dictionary.`,
                                    },
                                ],
                                color: 0xFF9900,
                                footer: { text: `👍 ${definition.thumbs_up.toString()} | 👎 ${definition.thumbs_down.toString()}`, icon_url: "https://www.urbandictionary.com/favicon.ico" },
                                timestamp: new Date(definition.written_on).toISOString(),
                            },
                        ] as any,
                    });
                } catch (error) {
                    sendBotMessage(ctx.channel.id, {
                        content: `Something went wrong: \`${error}\``,
                    });
                }
            }
        }
    ]
});
