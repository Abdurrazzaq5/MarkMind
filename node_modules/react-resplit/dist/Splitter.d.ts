import { ReactNode, HTMLAttributes } from 'react';
import type { PxValue, Order } from './types';
export declare type ResplitSplitterOptions = {
    /**
     * Set the size of the splitter as a pixel unit.
     *
     * @example '4px'
     *
     * @defaultValue '10px'
     */
    size?: PxValue;
};
export declare type ResplitSplitterProps = HTMLAttributes<HTMLDivElement> & ResplitSplitterOptions & {
    /**
     * The order of the splitter in the layout. {@link Order}
     */
    order: Order;
    /**
     * The content of the splitter.
     */
    children?: ReactNode;
    /**
     * Merges props onto the immediate child.
     *
     * @defaultValue false
     *
     * @example
     *
     * ```tsx
     * <ResplitSplitter asChild>
     *   <div style={{ backgroundColor: 'red' }}>
     *     ...
     *   </div>
     * </ResplitSplitter>
     * ```
     */
    asChild?: boolean;
};
/**
 * A splitter is a draggable element that can be used to resize panes.
 *
 * It must be a direct child of a {@link ResplitRoot} component.
 *
 * @example
 * ```tsx
 * <ResplitSplitter order={1} size={4} />
 * ```
 */
export declare const ResplitSplitter: import("react").ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & ResplitSplitterOptions & {
    /**
     * The order of the splitter in the layout. {@link Order}
     */
    order: Order;
    /**
     * The content of the splitter.
     */
    children?: ReactNode;
    /**
     * Merges props onto the immediate child.
     *
     * @defaultValue false
     *
     * @example
     *
     * ```tsx
     * <ResplitSplitter asChild>
     *   <div style={{ backgroundColor: 'red' }}>
     *     ...
     *   </div>
     * </ResplitSplitter>
     * ```
     */
    asChild?: boolean | undefined;
} & import("react").RefAttributes<HTMLDivElement>>;
