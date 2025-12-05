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
                arrivalDate: "2025-11-12",
                totalVolumeTm: 10
            }
        ];

        render(<DeliveryList deliveries={deliveries} onDelete={() => {}} />);

        expect(screen.getByText(/Driver X/i)).toBeInTheDocument();
        expect(screen.getByText(/WB-001/i)).toBeInTheDocument();
        expect(screen.getByText(/RMK/i)).toBeInTheDocument();
    });

    test("shows empty message when no deliveries", () => {
        render(<DeliveryList deliveries={[]} onDelete={() => {}} />);
        expect(screen.getByText(/pole veel lisatud/i)).toBeInTheDocument();
    });
});
