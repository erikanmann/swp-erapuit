import { render, screen, fireEvent } from "@testing-library/react";
import DeliveryForm from "../components/DeliveryForm";

describe("DeliveryForm", () => {
    test("renders required fields", () => {
        render(<DeliveryForm onSubmit={() => {}} />);

        expect(screen.getByLabelText(/Juhi nimi/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Veoki nr/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Veoselehe nr/i)).toBeInTheDocument();
    });

    test("shows error when submitting empty form", () => {
        render(<DeliveryForm onSubmit={() => {}} />);

        fireEvent.click(screen.getByRole("button", { name: /salvesta/i }));

        expect(screen.getAllByText(/kohustuslik/i).length).toBeGreaterThan(0);
    });
});
