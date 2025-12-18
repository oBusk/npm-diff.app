"use client";

import { type HTMLProps, memo } from "react";
import Tooltip from "./ui/Tooltip";

export interface ClientDateProps extends HTMLProps<HTMLDivElement> {
    time: string;
}

const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Prints dates in the clients timezone, but also shows the UTC time in a tooltip.
 */
const ClientDateInner = ({ time, ...props }: ClientDateProps) => {
    const date = new Date(time);

    const label = (
        <div className="flex flex-col gap-2">
            <div>
                {date.toLocaleString()}{" "}
                <span className="opacity-30">({currentTimezone})</span>
            </div>
            <div>
                {date.toLocaleString(undefined, {
                    timeZone: "UTC",
                })}{" "}
                <span className="opacity-30">(UTC)</span>
            </div>
        </div>
    );

    return (
        <Tooltip label={label}>
            <span {...props} suppressHydrationWarning>
                {date.toLocaleDateString(undefined)}
            </span>
        </Tooltip>
    );
};

const ClientDate = memo(ClientDateInner);

export default ClientDate;
