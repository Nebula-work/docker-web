import { Badge } from "@mantine/core";

interface StatusBadgeProps {
    status: "running" | "stopped" | "error" | "exited";
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const statusConfig = {
        running: {
            label: "Running",
            color: "green",
        },
        stopped: {
            label: "Stopped",
            color: "gray",
        },
        error: {
            label: "Error",
            color: "red",
        },
        exited: {
            label: "Exited",
            color: "gray",
        },
    };

    const config = statusConfig[status];

    return (
        <Badge
            color={config.color}
            variant="dot"
            size="sm"
            className={className}
        >
            {config.label}
        </Badge>
    );
}