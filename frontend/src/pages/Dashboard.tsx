import { Paper, Text, Group, Progress, Button, Stack } from "@mantine/core";
import { StatusBadge } from "@/components/StatusBadge";
import { Container, Image, HardDrive, Network, Play, Square, Cpu, MemoryStick } from "lucide-react";
import {useState,useEffect} from "react";
type RecentContainer = {
    id: string;
    name: string;
    status: "running" | "stopped";
    image: string;
    ports: string;
};
export default function Dashboard() {
const [containers, setContainers] = useState([]);
const [stats, setStats] = useState({
    containers: { total: 0, running: 0, stopped: 0 },
    images: { total: 0 },
    volumes: { total: 0 },
    networks: { total: 0 },
});

useEffect(() => {
    async function fetchStats() {
        const containersRes = await fetch("http://localhost:9000/api/v1/containers");
        const containersData = await containersRes.json();
        const imagesRes = await fetch("http://localhost:9000/api/v1/images");
        const imagesData = await imagesRes.json();
        const networksRes = await fetch("http://localhost:9000/api/v1/networks");
        const networksData = await networksRes.json();
        const volumesRes = await fetch("http://localhost:9000/api/v1/volumes");
        const volumesData = await volumesRes.json();
        console.log(volumesData.volumes);

        setStats({
            containers: {
                total: containersData.length,
                running: containersData.filter((c: any) => c.State === "running").length,
                stopped: containersData.filter((c: any) => c.State === "exited").length,
            },
            images: { total: imagesData.length },
            volumes: { total: volumesData.Volumes.length }, // Update if you have a volumes API
            networks: { total: networksData.length },
        });
        setContainers(containersData);
    }
    fetchStats();
}, []);

    const recentContainers: RecentContainer[] = containers.map((c: any) => ({
        id: c.Id,
        name: c.Names?.[0]?.replace(/^\//, "") ?? c.Id,
        status: c.State === "running" ? "running" : "stopped",
        image: c.Image,
        ports: (c.Ports && c.Ports.length > 0)
            ? c.Ports.map((p: any) => `${p.PublicPort}:${p.PrivatePort}`).join(", ")
            : "—"
    }));

    return (
        <div className="flex-1 space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to Docker Web - Manage your containers, images, and more
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Paper p="md" className="card-3d">
                    <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>Containers</Text>
                        <Container className="h-4 w-4 text-muted-foreground" />
                    </Group>
                    <Text size="xl" fw={700}>{stats.containers.total}</Text>
                    <Group gap="lg" mt="xs">
                        <Group gap="xs">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <Text size="xs" c="dimmed">{stats.containers.running} running</Text>
                        </Group>
                        <Group gap="xs">
                            <div className="w-2 h-2 rounded-full bg-status-stopped" />
                            <Text size="xs" c="dimmed">{stats.containers.stopped} stopped</Text>
                        </Group>
                    </Group>
                </Paper>

                <Paper p="md" className="card-3d">
                    <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>Images</Text>
                        <Image className="h-4 w-4 text-muted-foreground" />
                    </Group>
                    <Text size="xl" fw={700}>{stats.images.total}</Text>
                    <Text size="xs" c="dimmed" mt="xs">
                        Available locally
                    </Text>
                </Paper>

                <Paper p="md" className="card-3d">
                    <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>Volumes</Text>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </Group>
                    <Text size="xl" fw={700}>{stats.volumes.total}</Text>
                    <Text size="xs" c="dimmed" mt="xs">
                        Persistent storage
                    </Text>
                </Paper>

                <Paper p="md" className="card-3d">
                    <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>Networks</Text>
                        <Network className="h-4 w-4 text-muted-foreground" />
                    </Group>
                    <Text size="xl" fw={700}>{stats.networks.total}</Text>
                    <Text size="xs" c="dimmed" mt="xs">
                        Virtual networks
                    </Text>
                </Paper>
            </div>

            {/* System Resources */}
            <div className="grid gap-4 md:grid-cols-2">
                <Paper p="md" className="card-3d">
                    <Group gap="xs" mb="md">
                        <Cpu className="h-4 w-4" />
                        <Text fw={500}>CPU Usage</Text>
                    </Group>
                    <Text size="xl" fw={700}>24%</Text>
                    <Progress value={24} mt="sm" />
                    <Text size="xs" c="dimmed" mt="xs">
                        4 cores available
                    </Text>
                </Paper>

                <Paper p="md" className="card-3d">
                    <Group gap="xs" mb="md">
                        <MemoryStick className="h-4 w-4" />
                        <Text fw={500}>Memory Usage</Text>
                    </Group>
                    <Text size="xl" fw={700}>68%</Text>
                    <Progress value={68} mt="sm" />
                    <Text size="xs" c="dimmed" mt="xs">
                        5.4 GB / 8 GB used
                    </Text>
                </Paper>
            </div>

            {/* Recent Containers */}
            <Paper p="md" className="card-3d">
                <Stack gap="md">
                    <div>
                        <Text fw={500} mb="xs">Recent Containers</Text>
                        <Text size="sm" c="dimmed">
                            Recently created or modified containers
                        </Text>
                    </div>
                    <Stack gap="md">
                        {recentContainers.map((container) => (
                            <Paper
                                key={container.id}
                                p="md"
                                className="card-3d-sm hover:bg-accent/50 transition-all duration-200"
                            >
                                <Group justify="space-between">
                                    <Group gap="md">
                                        <Container className="h-8 w-8 text-muted-foreground" />
                                        <div>
                                            <Text fw={500}>{container.name}</Text>
                                            <Text size="sm" c="dimmed">{container.image}</Text>
                                        </div>
                                    </Group>
                                    <Group gap="md">
                                        <div className="text-right">
                                            <Text size="sm" fw={500}>{container.ports}</Text>
                                            <Text size="xs" c="dimmed">Ports</Text>
                                        </div>
                                        <StatusBadge status={container.status} />
                                        <Group gap="xs">
                                            {container.status === "running" ? (
                                                <Button variant="subtle" size="compact-sm">
                                                    <Square className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button variant="subtle" size="compact-sm">
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </Group>
                                    </Group>
                                </Group>
                            </Paper>
                        ))}
                    </Stack>
                </Stack>
            </Paper>
        </div>
    );
}