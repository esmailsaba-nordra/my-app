
export default async function fetchRickAndMortyData() {
	const response = await fetch("https://rickandmortyapi.com/api/character");
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
}
