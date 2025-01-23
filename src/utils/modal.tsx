/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
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

import {findByPropsLazy, findModuleId, proxyLazyWebpack, wreq} from "@webpack";
import type {ComponentType, PropsWithChildren, ReactNode, Ref} from "react";

import {LazyComponent} from "./react";

export const enum ModalSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    DYNAMIC = "dynamic",
}

const enum ModalTransitionState {
    ENTERING,
    ENTERED,
    EXITING,
    EXITED,
    HIDDEN,
}

export interface ModalProps {
    transitionState: ModalTransitionState;

    onClose(): void;
}

export interface ModalOptions {
    modalKey?: string;
    onCloseRequest?: (() => void);
    onCloseCallback?: (() => void);
}

type RenderFunction = (props: ModalProps) => ReactNode | Promise<ReactNode>;

export const Modals = findByPropsLazy("ModalRoot", "ModalCloseButton") as {
    ModalRoot: ComponentType<PropsWithChildren<{
        transitionState: ModalTransitionState;
        size?: ModalSize;
        role?: "alertdialog" | "dialog";
        className?: string;
        fullscreenOnMobile?: boolean;
        "aria-label"?: string;
        "aria-labelledby"?: string;
        onAnimationEnd?(): string;
    }>>;
    ModalHeader: ComponentType<PropsWithChildren<{
        /** Flex.Justify.START */
        justify?: string;
        /** Flex.Direction.HORIZONTAL */
        direction?: string;
        /** Flex.Align.CENTER */
        align?: string;
        /** Flex.Wrap.NO_WRAP */
        wrap?: string;
        separator?: boolean;

        className?: string;
    }>>;
    /** This also accepts Scroller props but good luck with that */
    ModalContent: ComponentType<PropsWithChildren<{
        className?: string;
        scrollerRef?: Ref<HTMLElement>;
        [prop: string]: any;
    }>>;
    ModalFooter: ComponentType<PropsWithChildren<{
        /** Flex.Justify.START */
        justify?: string;
        /** Flex.Direction.HORIZONTAL_REVERSE */
        direction?: string;
        /** Flex.Align.STRETCH */
        align?: string;
        /** Flex.Wrap.NO_WRAP */
        wrap?: string;
        separator?: boolean;

        className?: string;
    }>>;
    ModalCloseButton: ComponentType<{
        focusProps?: any;
        onClick(): void;
        withCircleBackground?: boolean;
        hideOnFullscreen?: boolean;
        className?: string;
    }>;
};

export type MediaModalItem = {
    url: string;
    type: "IMAGE" | "VIDEO";
    original?: string;
    alt?: string;
    width?: number;
    height?: number;
    animated?: boolean;
    maxWidth?: number;
    maxHeight?: number;
} & Record<PropertyKey, any>;

export type MediaModalProps = {
    location?: string;
    contextKey?: string;
    onCloseCallback?: () => void;
    className?: string;
    items: MediaModalItem[];
    startingIndex?: number;
    onIndexChange?: (...args: any[]) => void;
    fit?: string;
    shouldRedactExplicitContent?: boolean;
    shouldHideMediaOptions?: boolean;
    shouldAnimateCarousel?: boolean;
};

export const openMediaModal: (props: MediaModalProps) => void = proxyLazyWebpack(() => {
    const mediaModalKeyModuleId = findModuleId('"Zoomed Media Modal"');
    if (mediaModalKeyModuleId == null) return;

    const openMediaModalModule = wreq(findModuleId(mediaModalKeyModuleId, "modalKey:") as any);
    return Object.values<any>(openMediaModalModule).find(v => String(v).includes("modalKey:"));
});

export const ModalRoot = LazyComponent(() => Modals.ModalRoot);
export const ModalHeader = LazyComponent(() => Modals.ModalHeader);
export const ModalContent = LazyComponent(() => Modals.ModalContent);
export const ModalFooter = LazyComponent(() => Modals.ModalFooter);
export const ModalCloseButton = LazyComponent(() => Modals.ModalCloseButton);

export const ModalAPI = findByPropsLazy("openModalLazy");

/**
 * Wait for the render promise to resolve, then open a modal with it.
 * This is equivalent to render().then(openModal)
 * You should use the Modal components exported by this file
 */
export const openModalLazy: (render: () => Promise<RenderFunction>, options?: ModalOptions & { contextKey?: string; }) => Promise<string>
    = proxyLazyWebpack(() => ModalAPI.openModalLazy);

/**
 * Open a Modal with the given render function.
 * You should use the Modal components exported by this file
 */
export const openModal: (render: RenderFunction, options?: ModalOptions, contextKey?: string) => string
    = proxyLazyWebpack(() => ModalAPI.openModal);

/**
 * Close a modal by its key
 */
export const closeModal: (modalKey: string, contextKey?: string) => void
    = proxyLazyWebpack(() => ModalAPI.closeModal);

/**
 * Close all open modals
 */
export const closeAllModals: () => void
    = proxyLazyWebpack(() => ModalAPI.closeAllModals);

