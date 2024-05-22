import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import RickAndMortyComponent from "./RickAndMortyComponent";
import ChatBox from "./chatbox";

// Create a client
const queryClient = new QueryClient();

function App() {
	const [showChat, setShowChat] = useState(false);

	return (
		<QueryClientProvider client={queryClient}>
			{showChat ? <ChatBox /> : <RickAndMortyComponent />}
			<button onClick={() => setShowChat(!showChat)}>
				{showChat ? "Show Data" : "Show Chat"}
			</button>
		</QueryClientProvider>
	);
}

export default App;
