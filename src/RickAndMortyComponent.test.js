import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import RickAndMortyComponent from "./RickAndMortyComponent";
import fetchRickAndMortyData from "./fetchRickAndMortyData";

jest.mock("./fetchRickAndMortyData", () => jest.fn());

const queryClient = new QueryClient();

describe("RickAndMortyComponent", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("renders loading state", async () => {
		fetchRickAndMortyData.mockImplementation(() => new Promise(() => {}));
		const { getByText } = render(
			<QueryClientProvider client={queryClient}>
				<RickAndMortyComponent />
			</QueryClientProvider>,
		);
		expect(getByText("Loading...")).toBeInTheDocument();
	});

	test.only("renders success state and refreshes data when button is clicked", async () => {
		fetchRickAndMortyData.mockImplementation(() =>
			Promise.resolve({
				results: [{ id: 1, name: "Rick Sanchez", status: "Alive" }],
			}),
		);
		const { getByText, findByText } = render(
			<QueryClientProvider client={queryClient}>
				<RickAndMortyComponent />
			</QueryClientProvider>,
		);
		const rickSanchezElement = await waitFor(() => findByText("Rick Sanchez"), {
			timeout: 3000,
		});
		expect(rickSanchezElement).toBeInTheDocument();
		fireEvent.click(getByText("Refresh"));
		expect(fetchRickAndMortyData).toHaveBeenCalledTimes(2);
	});
});
