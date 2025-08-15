import { useState } from "react";
import {
    Modal,
    Button,
    TextInput,
    Textarea,
    Switch,
    Tabs,
    Stack,
    Group,
    Text,
    Grid,
} from "@mantine/core";
import { Container, Plus, X } from "lucide-react";
import { notifications } from "@mantine/notifications";

interface RunContainerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RunContainerModal({ open, onOpenChange }: RunContainerModalProps) {
    const [containerConfig, setContainerConfig] = useState({
        name: "",
        image: "nginx:latest",
        ports: [{ host: "", container: "" }],
        volumes: [{ host: "", container: "" }],
        environment: [{ key: "", value: "" }],
        command: "",
        detached: true,
        interactive: false,
        tty: false,
        removeOnExit: false,
    });

    const addPort = () => setContainerConfig(prev => ({
        ...prev,
        ports: [...prev.ports, { host: "", container: "" }]
    }));

    const addVolume = () => setContainerConfig(prev => ({
        ...prev,
        volumes: [...prev.volumes, { host: "", container: "" }]
    }));

    const addEnvironment = () => setContainerConfig(prev => ({
        ...prev,
        environment: [...prev.environment, { key: "", value: "" }]
    }));

    const removePort = (index: number) => setContainerConfig(prev => ({
        ...prev,
        ports: prev.ports.filter((_, i) => i !== index)
    }));

    const removeVolume = (index: number) => setContainerConfig(prev => ({
        ...prev,
        volumes: prev.volumes.filter((_, i) => i !== index)
    }));

    const removeEnvironment = (index: number) => setContainerConfig(prev => ({
        ...prev,
        environment: prev.environment.filter((_, i) => i !== index)
    }));

    const handleRun = () => {
        console.log("Running container with config:", containerConfig);
        notifications.show({
            title: "Container Started",
            message: `Container ${containerConfig.name || containerConfig.image} is now running`,
            color: "green",
        });
        onOpenChange(false);
    };

    return (
        <Modal
            opened={open}
            onClose={() => onOpenChange(false)}
            title={
                <Group>
                    <Container size={20} />
                    <Text fw={600}>Run New Container</Text>
                </Group>
            }
            size="lg"
        >
            <Tabs defaultValue="general">
                <Tabs.List>
                    <Tabs.Tab value="general">General</Tabs.Tab>
                    <Tabs.Tab value="ports">Ports</Tabs.Tab>
                    <Tabs.Tab value="volumes">Volumes</Tabs.Tab>
                    <Tabs.Tab value="environment">Environment</Tabs.Tab>
                    <Tabs.Tab value="advanced">Advanced</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general">
                    <Stack gap="md" mt="md">
                        <TextInput
                            label="Container Name"
                            placeholder="my-container (optional)"
                            value={containerConfig.name}
                            onChange={(e) => setContainerConfig(prev => ({ ...prev, name: e.target.value }))}
                        />

                        <TextInput
                            label="Image *"
                            placeholder="nginx:latest"
                            value={containerConfig.image}
                            onChange={(e) => setContainerConfig(prev => ({ ...prev, image: e.target.value }))}
                        />

                        <Textarea
                            label="Command"
                            placeholder="Override default command (optional)"
                            value={containerConfig.command}
                            onChange={(e) => setContainerConfig(prev => ({ ...prev, command: e.target.value }))}
                        />
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="ports">
                    <Stack gap="md" mt="md">
                        <Group justify="space-between">
                            <Text fw={500}>Port Mappings</Text>
                            <Button variant="outline" size="sm" onClick={addPort} leftSection={<Plus size={16} />}>
                                Add Port
                            </Button>
                        </Group>

                        {containerConfig.ports.map((port, index) => (
                            <Grid key={index} align="center">
                                <Grid.Col span={5}>
                                    <TextInput
                                        placeholder="Host port"
                                        value={port.host}
                                        onChange={(e) => {
                                            const newPorts = [...containerConfig.ports];
                                            newPorts[index].host = e.target.value;
                                            setContainerConfig(prev => ({ ...prev, ports: newPorts }));
                                        }}
                                    />
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Text ta="center">:</Text>
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <TextInput
                                        placeholder="Container port"
                                        value={port.container}
                                        onChange={(e) => {
                                            const newPorts = [...containerConfig.ports];
                                            newPorts[index].container = e.target.value;
                                            setContainerConfig(prev => ({ ...prev, ports: newPorts }));
                                        }}
                                    />
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Button
                                        variant="subtle"
                                        size="sm"
                                        color="red"
                                        onClick={() => removePort(index)}
                                        disabled={containerConfig.ports.length === 1}
                                    >
                                        <X size={16} />
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        ))}
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="volumes">
                    <Stack gap="md" mt="md">
                        <Group justify="space-between">
                            <Text fw={500}>Volume Mounts</Text>
                            <Button variant="outline" size="sm" onClick={addVolume} leftSection={<Plus size={16} />}>
                                Add Volume
                            </Button>
                        </Group>

                        {containerConfig.volumes.map((volume, index) => (
                            <Grid key={index} align="center">
                                <Grid.Col span={5}>
                                    <TextInput
                                        placeholder="Host path"
                                        value={volume.host}
                                        onChange={(e) => {
                                            const newVolumes = [...containerConfig.volumes];
                                            newVolumes[index].host = e.target.value;
                                            setContainerConfig(prev => ({ ...prev, volumes: newVolumes }));
                                        }}
                                    />
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Text ta="center">:</Text>
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <TextInput
                                        placeholder="Container path"
                                        value={volume.container}
                                        onChange={(e) => {
                                            const newVolumes = [...containerConfig.volumes];
                                            newVolumes[index].container = e.target.value;
                                            setContainerConfig(prev => ({ ...prev, volumes: newVolumes }));
                                        }}
                                    />
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Button
                                        variant="subtle"
                                        size="sm"
                                        color="red"
                                        onClick={() => removeVolume(index)}
                                        disabled={containerConfig.volumes.length === 1}
                                    >
                                        <X size={16} />
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        ))}
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="environment">
                    <Stack gap="md" mt="md">
                        <Group justify="space-between">
                            <Text fw={500}>Environment Variables</Text>
                            <Button variant="outline" size="sm" onClick={addEnvironment} leftSection={<Plus size={16} />}>
                                Add Variable
                            </Button>
                        </Group>

                        {containerConfig.environment.map((env, index) => (
                            <Grid key={index} align="center">
                                <Grid.Col span={5}>
                                    <TextInput
                                        placeholder="KEY"
                                        value={env.key}
                                        onChange={(e) => {
                                            const newEnv = [...containerConfig.environment];
                                            newEnv[index].key = e.target.value;
                                            setContainerConfig(prev => ({ ...prev, environment: newEnv }));
                                        }}
                                    />
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Text ta="center">=</Text>
                                </Grid.Col>
                                <Grid.Col span={5}>
                                    <TextInput
                                        placeholder="value"
                                        value={env.value}
                                        onChange={(e) => {
                                            const newEnv = [...containerConfig.environment];
                                            newEnv[index].value = e.target.value;
                                            setContainerConfig(prev => ({ ...prev, environment: newEnv }));
                                        }}
                                    />
                                </Grid.Col>
                                <Grid.Col span={1}>
                                    <Button
                                        variant="subtle"
                                        size="sm"
                                        color="red"
                                        onClick={() => removeEnvironment(index)}
                                        disabled={containerConfig.environment.length === 1}
                                    >
                                        <X size={16} />
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        ))}
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="advanced">
                    <Stack gap="md" mt="md">
                        <Switch
                            label="Run in detached mode"
                            description="Run container in background"
                            checked={containerConfig.detached}
                            onChange={(e) => setContainerConfig(prev => ({ ...prev, detached: e.currentTarget.checked }))}
                        />

                        <Switch
                            label="Interactive mode"
                            description="Keep STDIN open"
                            checked={containerConfig.interactive}
                            onChange={(e) => setContainerConfig(prev => ({ ...prev, interactive: e.currentTarget.checked }))}
                        />

                        <Switch
                            label="Allocate TTY"
                            description="Allocate a pseudo-TTY"
                            checked={containerConfig.tty}
                            onChange={(e) => setContainerConfig(prev => ({ ...prev, tty: e.currentTarget.checked }))}
                        />

                        <Switch
                            label="Remove on exit"
                            description="Automatically remove container when it exits"
                            checked={containerConfig.removeOnExit}
                            onChange={(e) => setContainerConfig(prev => ({ ...prev, removeOnExit: e.currentTarget.checked }))}
                        />
                    </Stack>
                </Tabs.Panel>
            </Tabs>

            <Group justify="flex-end" mt="md">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button onClick={handleRun} disabled={!containerConfig.image}>
                    Run Container
                </Button>
            </Group>
        </Modal>
    );
}