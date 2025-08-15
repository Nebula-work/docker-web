import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    Box,
    ScrollArea,
    Group,
    Text,
    NavLink as MantineNavLink,
    Stack,
    Button,
    ActionIcon
} from "@mantine/core";
import {LoginModal}  from "@/components/modals/LoginModals.tsx";
import {
    LayoutDashboard,
    Container,
    HardDrive,
    Network,
    Settings,
    FileImage,
    User
} from "lucide-react";

const items = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Containers", url: "/containers", icon: Container },
    { title: "Images", url: "/images", icon: FileImage },
    { title: "Volumes", url: "/volumes", icon: HardDrive },
    { title: "Networks", url: "/networks", icon: Network },
    { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
    const location = useLocation();
    const currentPath = location.pathname;
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    return (
        <>
            <Box className="h-full bg-card border-r border-border">
                <Group p="md" className="border-b border-border" justify="space-between">
                    <Group>
                        <Container className="h-8 w-8 text-primary" />
                        <Text size="lg" fw={600} className="text-foreground">
                            Docker Web
                        </Text>
                    </Group>
                </Group>

                <ScrollArea className="flex-1">
                    <Stack gap={1} p="xs">
                        {items.map((item) => (
                            <MantineNavLink
                                key={item.title}
                                component={NavLink}
                                to={item.url}
                                label={item.title}
                                leftSection={<item.icon size={18} />}
                                active={currentPath === item.url}
                                className="rounded-md hover:bg-muted/50"
                                styles={{
                                    root: {
                                        color: currentPath === item.url ? 'var(--mantine-color-white)' : 'var(--mantine-color-gray-4)',
                                        backgroundColor: currentPath === item.url ? 'var(--mantine-color-blue-6)' : 'transparent',
                                    },
                                    label: {
                                        fontWeight: currentPath === item.url ? 600 : 400,
                                    },
                                }}
                            />
                        ))}
                    </Stack>
                </ScrollArea>

                <Box p="md" className="border-t border-border">
                    <Button
                        variant="outline"
                        fullWidth
                        leftSection={<User size={16} />}
                        onClick={() => setLoginModalOpen(true)}
                    >
                        Sign in
                    </Button>
                </Box>
            </Box>

            <LoginModal
                open={loginModalOpen}
                onOpenChange={setLoginModalOpen}
            />
        </>
    );
}