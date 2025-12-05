import { render, screen } from "@testing-library/react";
import DeliveryList from "../components/DeliveryList";

describe("DeliveryList", () => {
    test("displays deliveries", () => {
        const deliveries = [
            {
                id: 1,
                driverName: "Driver X",
                truckNo: "TRUCK123",
                waybillNo: "WB-001",
                supplierName: "RMK",
                arrivalDate: "2025-11-12T00:00:00",
                totalVolumeTm: 10
            }
        ];

        render(
            <DeliveryList
                pageData={{
                    content: deliveries,
                    number: 0,
                    totalPages: 1
                }}
                onPageChange={() => {}}
                onDelete={() => {}}
            />
        );

        expect(screen.getByText(/Driver X/i)).toBeInTheDocument();
        expect(screen.getByText(/WB-001/i)).toBeInTheDocument();
        expect(screen.getByText(/RMK/i)).toBeInTheDocument();
    });

    test("shows empty message when no deliveries", () => {
        render(
            <DeliveryList
                pageData={{
                    content: [],
                    number: 0,
                    totalPages: 1
                }}
                onPageChange={() => {}}
                onDelete={() => {}}
            />
        );

        expect(screen.getByText(/Veoselehti pole veel lisatud/i)).toBeInTheDocument();
    });
});
