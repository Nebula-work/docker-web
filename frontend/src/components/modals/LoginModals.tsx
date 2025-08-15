import { useState } from "react";
import {
    Modal,
    Button,
    TextInput,
    PasswordInput,
    Stack,
    Group,
    Text,
    Divider,
    Anchor,
    Paper,
    Box
} from "@mantine/core";
import { Container, User, Key } from "lucide-react";

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
    const [loginType, setLoginType] = useState<"docker" | "registry">("docker");
    const [dockerUsername, setDockerUsername] = useState("");
    const [dockerPassword, setDockerPassword] = useState("");
    const [registryUrl, setRegistryUrl] = useState("");
    const [registryUsername, setRegistryUsername] = useState("");
    const [registryPassword, setRegistryPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        // Simulate login process
        setTimeout(() => {
            setIsLoading(false);
            onOpenChange(false);
            // Reset form
            setDockerUsername("");
            setDockerPassword("");
            setRegistryUrl("");
            setRegistryUsername("");
            setRegistryPassword("");
        }, 2000);
    };

    return (
        <Modal
            opened={open}
            onClose={() => onOpenChange(false)}
            title={
                <Group>
                    <Container size={20} />
                    <Text fw={600}>Sign in to Docker</Text>
                </Group>
            }
            size="md"
        >
            <Stack gap="md">
                <Group justify="center" gap="xs">
                    <Button
                        variant={loginType === "docker" ? "filled" : "outline"}
                        onClick={() => setLoginType("docker")}
                        size="sm"
                        leftSection={<Container size={16} />}
                    >
                        Docker Hub
                    </Button>
                    <Button
                        variant={loginType === "registry" ? "filled" : "outline"}
                        onClick={() => setLoginType("registry")}
                        size="sm"
                        leftSection={<Key size={16} />}
                    >
                        Private Registry
                    </Button>
                </Group>

                <Divider />

                {loginType === "docker" ? (
                    <Stack gap="md">
                        <Text size="sm" c="dimmed">
                            Sign in to your Docker Hub account to access your private repositories
                        </Text>

                        <TextInput
                            label="Docker ID or Email"
                            placeholder="Enter your Docker ID or email"
                            value={dockerUsername}
                            onChange={(e) => setDockerUsername(e.target.value)}
                            leftSection={<User size={16} />}
                            disabled={isLoading}
                        />

                        <PasswordInput
                            label="Password"
                            placeholder="Enter your password"
                            value={dockerPassword}
                            onChange={(e) => setDockerPassword(e.target.value)}
                            disabled={isLoading}
                        />

                        <Group justify="space-between">
                            <Anchor size="sm" href="#">
                                Forgot password?
                            </Anchor>
                            <Anchor size="sm" href="#">
                                Create account
                            </Anchor>
                        </Group>
                    </Stack>
                ) : (
                    <Stack gap="md">
                        <Text size="sm" c="dimmed">
                            Connect to a private Docker registry
                        </Text>

                        <TextInput
                            label="Registry URL"
                            placeholder="registry.example.com"
                            value={registryUrl}
                            onChange={(e) => setRegistryUrl(e.target.value)}
                            disabled={isLoading}
                        />

                        <TextInput
                            label="Username"
                            placeholder="Enter username"
                            value={registryUsername}
                            onChange={(e) => setRegistryUsername(e.target.value)}
                            leftSection={<User size={16} />}
                            disabled={isLoading}
                        />

                        <PasswordInput
                            label="Password"
                            placeholder="Enter password"
                            value={registryPassword}
                            onChange={(e) => setRegistryPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </Stack>
                )}

                <Paper p="md" bg="dark.6" style={{ border: '1px solid var(--mantine-color-dark-4)' }}>
                    <Group gap="xs">
                        <Box
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'var(--mantine-color-yellow-5)'
                            }}
                        />
                        <Text size="xs" c="dimmed">
                            Your credentials are stored securely and used only for Docker operations
                        </Text>
                    </Group>
                </Paper>

                <Group justify="flex-end" mt="md">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLogin}
                        loading={isLoading}
                        disabled={
                            loginType === "docker"
                                ? !dockerUsername || !dockerPassword
                                : !registryUrl || !registryUsername || !registryPassword
                        }
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}