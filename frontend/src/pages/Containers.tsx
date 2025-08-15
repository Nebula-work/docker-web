import { useState } from "react";
import { Paper, Text, Button, TextInput, Group, Stack, Badge, Menu } from "@mantine/core";
import { StatusBadge } from "@/components/StatusBadge";
import { RunContainerModal } from "@/components/modals/RunContainerModal";
import {
    Container,
    Play,
    Square,
    Trash2,
    Terminal,
    MoreHorizontal,
    Search,
    Filter
} from "lucide-react";

export default function Containers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [runContainerOpen, setRunContainerOpen] = useState(false);

    const containers = [
        {
            id: "c1",
            name: "nginx-proxy",
            image: "nginx:latest",
            status: "running" as const,
            ports: "80:80, 443:443",
            created: "2 hours ago",
            size: "142 MB",
            cpu: "0.1%",
            memory: "45 MB / 512 MB"
        },
        {
            id: "c2",
            name: "postgres-db",
            image: "postgres:15",
            status: "running" as const,
            ports: "5432:5432",
            created: "1 day ago",
            size: "374 MB",
            cpu: "2.3%",
            memory: "180 MB / 1 GB"
        },
        {
            id: "c3",
            name: "redis-session",
            image: "redis:7",
            status: "stopped" as const,
            ports: "6379:6379",
            created: "3 days ago",
            size: "117 MB",
            cpu: "-",
            memory: "-"
        },
        {
            id: "c4",
            name: "node-api",
            image: "node:18",
            status: "running" as const,
            ports: "3000:3000",
            created: "1 hour ago",
            size: "256 MB",
            cpu: "5.2%",
            memory: "320 MB / 512 MB"
        },
        {
            id: "c5",
            name: "mongodb",
            image: "mongo:6",
            status: "exited" as const,
            ports: "27017:27017",
            created: "5 days ago",
            size: "448 MB",
            cpu: "-",
            memory: "-"
        },
        {
            id: "c6",
            name: "elasticsearch",
            image: "elasticsearch:8",
            status: "error" as const,
            ports: "9200:9200",
            created: "2 days ago",
            size: "892 MB",
            cpu: "-",
            memory: "-"
        }
    ];

    const filteredContainers = containers.filter(container =>
        container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        container.image.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: containers.length,
        running: containers.filter(c => c.status === "running").length,
        stopped: containers.filter(c => c.status === "stopped").length,
        exited: containers.filter(c => c.status === "exited").length,
        error: containers.filter(c => c.status === "error").length,
    };

    return (
        <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Containers</h1>
                    <p className="text-muted-foreground">
                        Manage your Docker containers - start, stop, and monitor their status
                    </p>
                </div>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setRunContainerOpen(true)}>
                    <Container className="mr-2 h-4 w-4" />
                    Run New Container
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-5">
                <Paper p="md" withBorder>
                    <Text size="xl" fw={700}>{stats.total}</Text>
                    <Text size="xs" c="dimmed">Total</Text>
                </Paper>
                <Paper p="md" withBorder>
                    <Text size="xl" fw={700} c="green">{stats.running}</Text>
                    <Text size="xs" c="dimmed">Running</Text>
                </Paper>
                <Paper p="md" withBorder>
                    <Text size="xl" fw={700} c="yellow">{stats.stopped}</Text>
                    <Text size="xs" c="dimmed">Stopped</Text>
                </Paper>
                <Paper p="md" withBorder>
                    <Text size="xl" fw={700} c="dimmed">{stats.exited}</Text>
                    <Text size="xs" c="dimmed">Exited</Text>
                </Paper>
                <Paper p="md" withBorder>
                    <Text size="xl" fw={700} c="red">{stats.error}</Text>
                    <Text size="xs" c="dimmed">Error</Text>
                </Paper>
            </div>

            {/* Search and Filters */}
            <Group gap="md">
                <TextInput
                    placeholder="Search containers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    leftSection={<Search className="h-4 w-4" />}
                    style={{ flex: 1, maxWidth: '400px' }}
                />
                <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                </Button>
            </Group>

            {/* Containers List */}
            <Paper p="md" withBorder>
                <Stack gap="md">
                    <div>
                        <Text fw={500}>All Containers</Text>
                        <Text size="sm" c="dimmed">
                            {filteredContainers.length} of {containers.length} containers
                        </Text>
                    </div>
                    <Stack gap="md">
                        {filteredContainers.map((container) => (
                            <Paper
                                key={container.id}
                                p="md"
                                withBorder
                                className="hover:bg-accent/50 transition-colors"
                            >
                                <Group justify="space-between">
                                    <Group gap="md" style={{ flex: 1 }}>
                                        <Container className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <Group gap="sm" mb="xs">
                                                <Text fw={500} truncate>{container.name}</Text>
                                                <StatusBadge status={container.status} />
                                            </Group>
                                            <Text size="sm" c="dimmed" truncate>{container.image}</Text>
                                            <Text size="xs" c="dimmed">Created {container.created}</Text>
                                        </div>
                                    </Group>

                                    <Group gap="lg" className="hidden md:flex">
                                        <div className="text-right">
                                            <Text size="sm" fw={500}>{container.ports}</Text>
                                            <Text size="xs" c="dimmed">Ports</Text>
                                        </div>
                                        <div className="text-right">
                                            <Text size="sm" fw={500}>{container.cpu}</Text>
                                            <Text size="xs" c="dimmed">CPU</Text>
                                        </div>
                                        <div className="text-right">
                                            <Text size="sm" fw={500}>{container.memory}</Text>
                                            <Text size="xs" c="dimmed">Memory</Text>
                                        </div>
                                        <div className="text-right">
                                            <Text size="sm" fw={500}>{container.size}</Text>
                                            <Text size="xs" c="dimmed">Size</Text>
                                        </div>
                                    </Group>

                                    <Group gap="xs" className="flex-shrink-0">
                                        {container.status === "running" ? (
                                            <Button variant="subtle" size="compact-sm">
                                                <Square className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button variant="subtle" size="compact-sm">
                                                <Play className="h-4 w-4" />
                                            </Button>
                                        )}

                                        <Button variant="subtle" size="compact-sm">
                                            <Terminal className="h-4 w-4" />
                                        </Button>

                                        <Menu withinPortal position="bottom-end">
                                            <Menu.Target>
                                                <Button variant="subtle" size="compact-sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Label>Actions</Menu.Label>
                                                <Menu.Item>View logs</Menu.Item>
                                                <Menu.Item>Inspect</Menu.Item>
                                                <Menu.Item>Rename</Menu.Item>
                                                <Menu.Divider />
                                                <Menu.Item color="red" leftSection={<Trash2 className="h-4 w-4" />}>
                                                    Delete
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Group>
                                </Group>
                            </Paper>
                        ))}
                    </Stack>
                </Stack>
            </Paper>

            <RunContainerModal open={runContainerOpen} onOpenChange={setRunContainerOpen} />
        </div>
    );
}