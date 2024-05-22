import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "axios";

function ChatBox() {
	const queryClient = useQueryClient();
	const [input, setInput] = useState("");
	const [editingMessage, setEditingMessage] = useState(null);
	const [updatedContent, setUpdatedContent] = useState("");

	const {
		data: messages,
		isLoading,
		error,
	} = useQuery("chatMessages", () =>
		axios
			.get("https://cljprgckwzzlsgnmntqw.supabase.co/functions/v1/fake-tasks")
			.then((res) => res.data),
	);

	const mutation = useMutation(
		(newMessage) =>
			axios.post(
				"https://cljprgckwzzlsgnmntqw.supabase.co/functions/v1/fake-tasks",
				newMessage,
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries("chatMessages");
			},
		},
	);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const newMessage = { content: input };
		await mutation.mutateAsync(newMessage);
		setInput("");
		const updatedData = queryClient.setQueryData("chatMessages", (old) => {
			const oldData = old?.data ?? [];
			oldData.push(newMessage);
			return { ...old, data: [...oldData] };
		});
		const channel = new BroadcastChannel("chat");
		channel.postMessage(updatedData);
		channel.close();
	};

	const handleUpdate = async (event, id, updatedContent) => {
		event.preventDefault();
		await axios.put(
			`https://cljprgckwzzlsgnmntqw.supabase.co/functions/v1/fake-tasks/${id}`,
			{ content: updatedContent },
		);
		const updatedData = queryClient.setQueryData("chatMessages", (old) => {
			const oldData = old?.data ?? [];
			return {
				...old,
				data: oldData.map((message) =>
					message.id === id ? { ...message, content: updatedContent } : message,
				),
			};
		});
		const channel = new BroadcastChannel("chat");
		channel.postMessage(updatedData);
		channel.close();
		setEditingMessage(null);
	};

	const handleDelete = async (id) => {
		await axios.delete(
			`https://cljprgckwzzlsgnmntqw.supabase.co/functions/v1/fake-tasks/${id}`,
		);
		const updatedData = queryClient.setQueryData("chatMessages", (old) => {
			const oldData = old?.data ?? [];
			return { ...old, data: oldData.filter((message) => message.id !== id) };
		});
		const channel = new BroadcastChannel("chat");
		channel.postMessage(updatedData);
		channel.close();
	};
	useEffect(() => {
		const channel = new BroadcastChannel("chat");

		channel.onmessage = (event) => {
			queryClient.setQueryData("chatMessages", event.data);
		};
		return () => {
			channel.close();
		};
	}, [queryClient]);
	if (isLoading) return "Loading...";
	if (error) return `An error has occurred: ${error.message}`;
	console.log(messages);
	return (
		<div>
			{messages?.data.map((message) => (
				<div key={message.id}>
					{message.content}
					<button type="button" onClick={() => setEditingMessage(message)}>
						Update
					</button>
					<button type="button" onClick={() => handleDelete(message.id)}>
						Delete
					</button>
				</div>
			))}
			{editingMessage && (
				<form
					onSubmit={(event) =>
						handleUpdate(event, editingMessage.id, updatedContent)
					}
				>
					<input
						value={updatedContent}
						onChange={(e) => setUpdatedContent(e.target.value)}
					/>
					<button type="submit">Update</button>
				</form>
			)}
			<form onSubmit={handleSubmit}>
				<input value={input} onChange={(e) => setInput(e.target.value)} />
				<button type="submit">Send</button>
			</form>
		</div>
	);
}

export default ChatBox;
