/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 nin0
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { ChannelStore, DateUtils, GuildStore, IconUtils, NavigationRouter, Popout, SelectedGuildStore, SnowflakeUtils, Text, UserStore, useStateFromStores } from "@webpack/common";

import { ArrowSvg, checkForIconExistence, cl, ServerProfileComponent } from "./utils";

export default definePlugin({
    name: "BetterForwardMeta",
    description: "Access server profile under forwarded messages (if available) and always show time",
    authors: [Devs.nin0dev],
    ForwardFooter(message: any) {
        const { guild_id, channel_id, message_id } = message.message.messageReference;
        const guild = useStateFromStores([GuildStore], () => GuildStore.getGuild(guild_id));
        const channel = useStateFromStores([ChannelStore], () => ChannelStore.getChannel(channel_id));

        return <div className={cl("footer")} >
            {
                guild_id && <>
                    {
                        guild_id !== SelectedGuildStore.getGuildId() && <Popout
                            position="top"
                            renderPopout={() => <ServerProfileComponent guildId={guild_id} />}
                        >
                            {popoutProps => <div className={cl("footer-element")} {...popoutProps}>
                                {
                                    checkForIconExistence(guild) && <img src={guild.icon && IconUtils.getGuildIconURL({
                                        id: guild.id,
                                        icon: guild.icon,
                                        canAnimate: true,
                                        size: 32
                                    })} alt={`Server icon for ${guild.name}`} className={cl("guild-icon")} />
                                }
                                <Text variant="text-sm/medium" className={cl("footer-text")} style={{
                                    marginLeft: checkForIconExistence(guild) ? "20px" : "0"
                                }}>{guild ? guild.name : "View server"} </Text>
                                <ArrowSvg />
                            </div>
                            }
                        </Popout>
                    }
                </>
            }
            {
                channel && <div className={cl("footer-element")} onClick={() => NavigationRouter.transitionTo(`/channels/${guild_id ?? "@me"}/${channel_id}/${message_id}`)} >
                    <Text variant="text-sm/medium" className={cl("footer-text")}>{(() => {
                        /*
                            - Text channel
                            - Voice channel
                            - Announcement channel
                            - Stage channel
                            - Forum channel
                            - Media channel
                        */
                        if ([0, 2, 5, 13, 15, 16].includes(channel.type)) return `#${channel.name}`;
                        // DMs
                        if (channel.type === 1) return `@${(() => {
                            const user = UserStore.getUser(channel.recipients[0]);
                            // @ts-expect-error
                            return user.globalName || user.username;
                        })()}`;
                        // GDMs
                        if (channel.type === 3) return channel.name || (() => {
                            const users = channel.recipients.map(r => UserStore.getUser(r));
                            // @ts-expect-error
                            return users.map(u => u.globalName || u.username).join(", ");
                        })();
                        // Threads
                        if ([10, 11, 12].includes(channel.type)) return channel.name;
                    })()}</Text>
                    <ArrowSvg />
                </div>
            }
            <div className={cl("footer-element")} style={{
                pointerEvents: "none"
            }}>
                <Text variant="text-sm/medium" className={cl("footer-text")}>
                    {DateUtils.calendarFormat(new Date(SnowflakeUtils.extractTimestamp(message_id)))}
                </Text>
            </div>
        </div>;
    },
    patches: [
        {
            find: "originLabel,\"  •  \"",
            replacement: {
                match: /(let{message:\i,snapshot:\i,index:\i}=(\i))(.{0,400})return .+TEXT_LOW_CONTRAST}\)]}\)/,
                replace: "$1$3return $self.ForwardFooter($2)"
            }
        }
    ]
});
