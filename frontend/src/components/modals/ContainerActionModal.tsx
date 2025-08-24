import { Modal, Group, Text, Button, Stack } from "@mantine/core";
import { Container, Play, Square } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {Container as ContainerType, startContainerThunk, stopContainerThunk} from "@/store/slices/containersSlice";
import {useAppDispatch} from "@/store/hooks.ts";

interface ContainerActionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    container: ContainerType | null;
    action: 'start' | 'stop';
}

export function ContainerActionModal({
                                         open,
                                         onOpenChange,
                                         container,
                                         action
                                     }: ContainerActionModalProps) {
    const dispatch = useAppDispatch();
    if (!container) return null;
    const isStart = action === 'start';
    const title = isStart ? 'Start Container' : 'Stop Container';
    const actionText = isStart ? 'start' : 'stop';
    const ActionIcon = isStart ? Play : Square;

    const handleConfirm = () => {
        if(isStart){
            console.log(container.Id)
            dispatch(startContainerThunk(container.Id))
        }else{
            console.log(container.Id)
            dispatch(stopContainerThunk(container.Id))
        }
        console.log(`${action}ing container:`, container.Names);
        onOpenChange(false);
    };



    return (
        <Modal
            opened={open}
            onClose={() => onOpenChange(false)}
            title={title}
            centered
        >
            <Stack gap="lg">
                <Group gap="md">
                    <Container className="h-8 w-8 text-muted-foreground" />
                    <div style={{ flex: 1 }}>
                        <Group gap="sm" mb="xs">
                            <Text fw={500}>{container.Names}</Text>
                            <StatusBadge status={container.State} />
                        </Group>
                        <Text size="sm" c="dimmed">{container.Image}</Text>
                    </div>
                </Group>

                <Text size="sm">
                    Are you sure you want to {actionText} the container <strong>{container.Names}</strong>?
                </Text>

                <Group justify="flex-end" gap="sm">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        color={isStart ? "green" : "red"}
                        leftSection={<ActionIcon className="h-4 w-4" />}
                    >
                        {isStart ? 'Start' : 'Stop'} Container
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}