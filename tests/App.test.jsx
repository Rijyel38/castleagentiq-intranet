import { render, screen } from "@testing-library/react";
import App from "../src/App.jsx";

describe("App shell", () => {
  it("renders intranet dashboard title", () => {
    render(<App />);
    expect(screen.getByText("CastleAgentIQ Intranet")).toBeInTheDocument();
  });
});
