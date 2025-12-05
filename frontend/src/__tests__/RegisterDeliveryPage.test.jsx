import { render, screen } from "@testing-library/react";
import RegisterDeliveryPage from "../pages/RegisterDeliveryPage";
import { BrowserRouter } from "react-router-dom";

describe("RegisterDeliveryPage", () => {
    test("renders page heading", () => {
        render(
            <BrowserRouter>
                <RegisterDeliveryPage />
            </BrowserRouter>
        );

        expect(
            screen.getByText(/Registreeri uus tarne/i)
        ).toBeInTheDocument();
    });
});
