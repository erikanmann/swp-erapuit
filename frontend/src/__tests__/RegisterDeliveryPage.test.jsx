import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegisterDeliveryPage from "../pages/RegisterDeliveryPage";
import { UserProvider } from "../context/UserContext";

describe("RegisterDeliveryPage", () => {
    test("renders page heading", () => {
        render(
            <UserProvider>
                <MemoryRouter initialEntries={["/register-delivery"]}>
                    <RegisterDeliveryPage />
                </MemoryRouter>
            </UserProvider>
        );

        expect(
            screen.getByRole("heading", {
                name: /Tarne registreerimine/i,
            })
        ).toBeInTheDocument();
    });
});
