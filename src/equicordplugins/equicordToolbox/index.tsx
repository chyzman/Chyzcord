/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "./style.css";

import { openNotificationLogModal } from "@api/Notifications/notificationLog";
import { migratePluginSettings, Settings, useSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { ChyzcordDevs, Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";
import { Menu, Popout, useRef, useState } from "@webpack/common";
import type { ReactNode } from "react";

const HeaderBarIcon = findComponentByCodeLazy(".HEADER_BAR_BADGE_TOP:", '.iconBadge,"top"');

function VencordPopout(onClose: () => void) {
    const { useQuickCss } = useSettings(["useQuickCss"]);

    const pluginEntries = [] as ReactNode[];

    for (const plugin of Object.values(Vencord.Plugins.plugins)) {
        if (plugin.toolboxActions && Vencord.Plugins.isPluginEnabled(plugin.name)) {
            pluginEntries.push(
                <Menu.MenuGroup
                    label={plugin.name}
                    key={`vc-toolbox-${plugin.name}`}
                >
                    {Object.entries(plugin.toolboxActions).map(([text, action]) => {
                        const key = `vc-toolbox-${plugin.name}-${text}`;

                        if (plugin.name === "Demonstration") {
                            const [demonstrationToggled, setToggled] = useState(false);

                            return (
                                <Menu.MenuCheckboxItem
                                    id="vc-toolbox-demonstration-toggle"
                                    key={key}
                                    checked={!!demonstrationToggled}
                                    label={text}
                                    action={
                                        () => {
                                            action();
                                            setToggled(!demonstrationToggled);
                                        }
                                    }
                                />
                            );
                        }

                        return (
                            <Menu.MenuItem
                                id={key}
                                key={key}
                                label={text}
                                action={action}
                            />
                        );
                    })}
                </Menu.MenuGroup>
            );
        }
    }

    return (
        <Menu.Menu
            navId="vc-toolbox"
            onClose={onClose}
        >
            <Menu.MenuItem
                id="vc-toolbox-notifications"
                label="Open Notification Log"
                action={openNotificationLogModal}
            />
            <Menu.MenuCheckboxItem
                id="vc-toolbox-quickcss-toggle"
                checked={useQuickCss}
                label={"Enable QuickCSS"}
                action={() => {
                    Settings.useQuickCss = !useQuickCss;
                }}
            />
            <Menu.MenuItem
                id="vc-toolbox-quickcss"
                label="Open QuickCSS"
                action={() => VencordNative.quickCss.openEditor()}
            />
            {...pluginEntries}
        </Menu.Menu>
    );
}

function VencordPopoutIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width={24} height={24}>
            <path fill="#FFAC33" d="M11.792 6.062l-.011 3.324L17.129 8l-2.936-2zm21.458 17.42c0-1.138.761-2.071 1.75-2.238V9.585c-4-.962-34 7.191-34 7.191v3.536c1.564.294 2.75 1.662 2.75 3.312S2.564 26.644 1 26.938v7.716l34-6.482v-2.451c-.989-.168-1.75-1.102-1.75-2.239z"/>
            <path fill="#FFD983" d="M15.585 2.242l-3.843 3.843c.737.172 1.258.591 1.258 1.082 0 .645-.896 1.167-2 1.167-.474 0-.903-.1-1.245-.26L1 16.828c13.167-2.911 22.042-5.286 34.1-7.226-4.862-6.482-16.273-7.36-19.515-7.36z"/>
            <path fill="#FFAC33" d="M20 5.167c0 .645-.896 1.167-2 1.167s-2-.522-2-1.167S16.896 4 18 4s2 .522 2 1.167zm-4.928 6.395c0 .978-1.359 1.771-3.036 1.771S9 12.54 9 11.562c0-.977 1.359-1.771 3.036-1.771 1.676.001 3.036.794 3.036 1.771zM29 8.352c0 1.094-1.521 1.981-3.396 1.981s-3.396-.887-3.396-1.981 1.521-1.981 3.396-1.981S29 7.258 29 8.352z"/>
            <path fill="#F4900C" d="M33.625 15.62c0 1.332-.979 2.411-2.188 2.411s-2.188-1.079-2.188-2.411.979-2.411 2.188-2.411 2.188 1.079 2.188 2.411zm-22.25 4.862c0 1.255-.923 2.272-2.062 2.272-1.139 0-2.062-1.018-2.062-2.272 0-1.256.923-2.273 2.062-2.273 1.139 0 2.062 1.018 2.062 2.273zm17.156 4.98c-.503.602-1.355.72-1.903.262-.547-.457-.582-1.317-.077-1.919.505-.605 1.356-.722 1.903-.265.548.458.582 1.317.077 1.922zm-9.684-7.378c-.677.811-1.825.97-2.562.353-.736-.615-.783-1.773-.104-2.583.68-.814 1.826-.971 2.562-.356.737.616.784 1.773.104 2.586zm.873 10.015c-1.2 1.604-3.354 2.021-4.808.933-1.455-1.088-1.663-3.272-.463-4.875 1.2-1.605 3.354-2.022 4.808-.935 1.455 1.088 1.663 3.272.463 4.877z"/>
        </svg>
    );
}

function VencordPopoutButton() {
    const buttonRef = useRef(null);
    const [show, setShow] = useState(false);

    return (
        <Popout
            position="bottom"
            align="center"
            spacing={0}
            animation={Popout.Animation.NONE}
            shouldShow={show}
            onRequestClose={() => setShow(false)}
            targetElementRef={buttonRef}
            renderPopout={() => VencordPopout(() => setShow(false))}
        >
            {(_, { isShown }) => (
                <HeaderBarIcon
                    ref={buttonRef}
                    className="vc-toolbox-btn"
                    onClick={() => setShow(v => !v)}
                    tooltip={isShown ? null : "Chyzcord Toolbox"}
                    icon={() => VencordPopoutIcon()}
                    selected={isShown}
                />
            )}
        </Popout>
    );
}

function ToolboxFragmentWrapper({ children }: { children: ReactNode[]; }) {
    children.splice(
        children.length - 1, 0,
        <ErrorBoundary noop>
            <VencordPopoutButton />
        </ErrorBoundary>
    );

    return <>{children}</>;
}

migratePluginSettings("ChyzcordToolbox", "EquicordToolbox", "VencordToolbox");
export default definePlugin({
    name: "ChyzcordToolbox",
    description: "Adds a button next to the inbox button in the channel header that houses Chyzcord quick actions",
    authors: [Devs.Ven, Devs.AutumnVN, ChyzcordDevs.chyzman],
    enabledByDefault: true,

    patches: [
        {
            find: ".controlButtonWrapper,",
            replacement: {
                match: /(?<=function (\i).{0,100}\()\i.Fragment,(?=.+?toolbar:\1\(\))/,
                replace: "$self.ToolboxFragmentWrapper,"
            }
        }
    ],

    ToolboxFragmentWrapper: ErrorBoundary.wrap(ToolboxFragmentWrapper, {
        fallback: () => <p style={{ color: "red" }}>Failed to render :(</p>
    })
});
