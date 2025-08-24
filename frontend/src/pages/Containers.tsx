import { useState, useEffect } from "react";
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
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {DockerPort, fetchContainers} from "@/store/slices/containersSlice";
import {ContainerActionModal} from "@/components/modals/ContainerActionModal.tsx";

export default function Containers() {
    const dispatch = useAppDispatch();
    const {containers,loading,error} = useAppSelector(state => state.containers);
    console.log(containers);
    const [searchTerm, setSearchTerm] = useState("");
    const [runContainerOpen, setRunContainerOpen] = useState(false);

    const [actionModal, setActionModal] = useState<{
        open: boolean;
        container: any;
        action: 'start' | 'stop';
    }>({
        open: false,
        container: null,
        action: 'start'
    });
    useEffect(() => {
        dispatch(fetchContainers());
    }, [dispatch]);

    const formatPorts = (ports: DockerPort[] | undefined) => {
        if (!ports || ports.length === 0) return [] as string[];
        // Group by PublicPort-PrivatePort-Type to deduplicate IPv4/IPv6 duplicates
        const grouped = new Map<string, DockerPort[]>();
        ports.forEach((p) => {
            const key = `${p?.PublicPort ?? ''}-${p?.PrivatePort ?? ''}-${p?.Type ?? ''}`;
            const arr = grouped.get(key) ?? [];
            arr.push(p);
            grouped.set(key, arr);
        });
        const result: string[] = [];
        grouped.forEach((list) => {
            // prefer IPv4 (0.0.0.0) over IPv6 (::) if both exist
            const chosen = list.find(p => p?.IP && p.IP !== '::') ?? list[0];
            const hasPublic = chosen?.PublicPort != null;
            const proto = chosen?.Type || 'tcp';
            if (hasPublic) {
                const ipPart = chosen?.IP ? `${chosen.IP}:` : '';
                result.push(`${ipPart}${chosen.PublicPort}->${chosen?.PrivatePort}/${proto}`);
            } else {
                result.push(`${chosen?.PrivatePort}/${proto}`);
            }
        });
        return result;
    };

    const filteredContainers = containers.filter(container =>
        container.Names?.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        container.Image?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: containers.length,
        running: containers.filter(c => c.State === "running").length,
        stopped: containers.filter(c => c.State === "stopped").length,
        exited: containers.filter(c => c.State === "exited").length,
        error: containers.filter(c => c.State === "error").length,
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
            // TODO:replace with mantine Gird
            <div className="grid gap-4 md:grid-cols-5">
                <Paper p="md" className="card-3d">
                    <Text size="xl" fw={700}>{stats.total}</Text>
                    <Text size="xs" c="dimmed">Total</Text>
                </Paper>
                <Paper p="md" className="card-3d">
                    <Text size="xl" fw={700} c="green">{stats.running}</Text>
                    <Text size="xs" c="dimmed">Running</Text>
                </Paper>
                <Paper p="md" className="card-3d">
                    <Text size="xl" fw={700} c="yellow">{stats.stopped}</Text>
                    <Text size="xs" c="dimmed">Stopped</Text>
                </Paper>
                <Paper p="md" className="card-3d">
                    <Text size="xl" fw={700} c="dimmed">{stats.exited}</Text>
                    <Text size="xs" c="dimmed">Exited</Text>
                </Paper>
                <Paper p="md" className="card-3d">
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
            <Paper p="md" className="card-3d">
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
                                key={container.Id}
                                p="md"

                                className="hover:bg-accent/50 transition-colors card-3d"
                            >
                                <Group justify="space-between">
                                    <Group gap="md" style={{ flex: 1 }}>
                                        <Container className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <Group gap="sm" mb="xs">
                                                <Text fw={500} truncate>{container.Names}</Text>
                                                <StatusBadge status={container.State} />
                                            </Group>
                                            <Text size="sm" c="dimmed" truncate>{container.Image}</Text>
                                            <Text size="xs" c="dimmed">Created {new Date(container.Created).toLocaleDateString()}</Text>
                                        </div>
                                    </Group>

                                    <Group gap="lg" className="hidden md:flex">
                                        <div className="text-right max-w-[320px]">
                                            <Group gap="xs" justify="flex-end" wrap="wrap">
                                                {formatPorts(container.Ports)?.length === 0 ? (
                                                    <Text size="sm" fw={500}>—</Text>
                                                ) : (
                                                    formatPorts(container.Ports).map((p, idx) => (
                                                        <Badge key={idx} variant="light" size="sm">{p}</Badge>
                                                    ))
                                                )}
                                            </Group>
                                            <Text size="xs" c="dimmed">Ports</Text>
                                        </div>
                                        {/*<div className="text-right">*/}
                                        {/*    <Text size="sm" fw={500}>{container.cpu}</Text>*/}
                                        {/*    <Text size="xs" c="dimmed">CPU</Text>*/}
                                        {/*</div>*/}
                                        {/*<div className="text-right">*/}
                                        {/*    <Text size="sm" fw={500}>{container.memory}</Text>*/}
                                        {/*    <Text size="xs" c="dimmed">Memory</Text>*/}
                                        {/*</div>*/}
                                        {/*<div className="text-right">*/}
                                        {/*    <Text size="sm" fw={500}>{container.size}</Text>*/}
                                        {/*    <Text size="xs" c="dimmed">Size</Text>*/}
                                        {/*</div>*/}
                                    </Group>

                                    <Group gap="xs" className="flex-shrink-0">
                                        {container.State === "running" ? (
                                            <Button
                                                variant="subtle"
                                                size="compact-sm"
                                                onClick={() => setActionModal({
                                                    open: true,
                                                    container,
                                                    action: 'stop'
                                                })}
                                            >
                                                <Square className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="subtle"
                                                size="compact-sm"
                                                onClick={() => setActionModal({
                                                    open: true,
                                                    container,
                                                    action: 'start'
                                                })}
                                            >
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
                                            <Menu.Dropdown className={"card-3d"}>
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
            <ContainerActionModal
                open={actionModal.open}
                onOpenChange={(open) => setActionModal(prev => ({ ...prev, open }))}
                container={actionModal.container}
                action={actionModal.action}
            />
        </div>
    );
}