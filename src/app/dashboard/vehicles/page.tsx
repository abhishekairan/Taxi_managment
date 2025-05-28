"use client";

import VehicleTable from "@/components/dashboard/vehicles/VehicleTable";
import EditVehicleModal from "@/components/dashboard/vehicles/EditVehicleModal";
import { VehicleDBType } from "@/lib/type";
import { Button, Container, Group, Paper, Title } from "@mantine/core";
import { IconCar } from "@tabler/icons-react";
import React, { useState } from "react";

export default function VehiclesDashboard() {
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleDBType | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleFormClose = (shouldRefresh?: boolean) => {
        setIsFormOpen(false);
        setSelectedVehicle(null);
        if (shouldRefresh) {
            setRefreshKey(prev => prev + 1);
        }
    };

    return (
        <Container size="2xl">
            <Paper p="md" radius="md">
                <Group justify="space-between" mb="lg">
                    <Title order={2}>Vehicles</Title>
                    <Button
                        leftSection={<IconCar size={16} />}
                        onClick={() => {
                            setSelectedVehicle(null);
                            setIsFormOpen(true);
                        }}
                    >
                        Add Vehicle
                    </Button>
                </Group>
                
                <VehicleTable
                    setEditData={setSelectedVehicle}
                    editModelHandler={{
                        open: () => setIsFormOpen(true)
                    }}
                    refreshTrigger={refreshKey}
                />
            </Paper>

            <EditVehicleModal
                opened={isFormOpen}
                onClose={handleFormClose}
                data={selectedVehicle}
            />
        </Container>
    );
}
