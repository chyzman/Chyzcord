/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { cl, IconProps } from "../misc/types";

export function Icon({ width = 24, height = 24 }: IconProps) {
    return (
        <svg viewBox="0 96 960 960" height={width} width={height} className={cl("icon")}>
            <path fill="currentColor" d="m475 976 181-480h82l186 480h-87l-41-126H604l-47 126h-82Zm151-196h142l-70-194h-2l-70 194Zm-466 76-55-55 204-204q-38-44-67.5-88.5T190 416h87q17 33 37.5 62.5T361 539q45-47 75-97.5T487 336H40v-80h280v-80h80v80h280v80H567q-22 69-58.5 135.5T419 598l98 99-30 81-127-122-200 200Z" />
            <path fill="currentColor" d="m 830.17456,136.43701 c -11.54729,0 -20.84473,8.71252 -20.84473,19.53369 v 66.21826 h -66.21826 c -10.82122,0 -19.53369,9.29373 -19.53369,20.84107 0,11.54734 8.71247,20.84473 19.53369,20.84473 h 66.21826 v 66.21826 c 0,10.8212 9.29742,19.53369 20.84473,19.53369 11.54731,0 20.84106,-8.71249 20.84106,-19.53369 v -66.21826 h 66.21827 c 10.82124,0 19.53369,-9.29737 19.53369,-20.84473 0,-11.54736 -8.71245,-20.84107 -19.53369,-20.84107 H 851.01562 V 155.9707 c 0,-10.82117 -9.29377,-19.53369 -20.84106,-19.53369 z" />
            <rect fill="currentColor" width="0.42110577" height="2.1055288" x="848.52814" y="112.42313" ry="0.2105529" />
        </svg>
    );
}