import React from "react";
import { useQuery, useQueryClient } from "react-query";

import fetchRickAndMortyData from "./fetchRickAndMortyData";

const RickAndMortyComponent = () => {
	const queryClient = useQueryClient();

	const { data, status, error, isFetching, isStale } = useQuery(
		"rickAndMortyData",
		fetchRickAndMortyData,
		{
			staleTime: 1000 * 60 * 5, // data will be considered stale after 5 minutes
			cacheTime: 1000 * 60 * 30, // data will be removed from the cache after 30 minutes
			retry: 1, // retry once if the fetch fails
		},
	);
  const handleRefresh = () => {
		queryClient.invalidateQueries("rickAndMortyData");
	};
  React.useEffect(() => {
    if (data) {
      if (isFetching && !isStale) {
        console.log("Data is being fetched for the first time");
      } else if (!isFetching && isStale) {
        console.log("Data is stale and is being refetched in the background");
      } else if (!isFetching && !isStale) {
        console.log("Data is fresh and came from the cache");
      }
    }
  }, [data, isFetching, isStale]);

	React.useEffect(() => {
		const cachedData = queryClient.getQueryData("rickAndMortyData");
		if (cachedData) {
			console.log("Data is cached");
		} else {
			console.log("Data is not cached");
		}
	}, [queryClient,data]);

	

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	if (status === "error") {
		return <div>Error: {error.message}</div>;
	}
	console.log(status);

	return (
		<div>
			<button type="button" onClick={handleRefresh}>
				Refresh
			</button>

			{data.results.map((character) => (
				<div key={character.id}>
					<h2>{character.name}</h2>
				
				</div>
			))}
		</div>
	);
};

export default RickAndMortyComponent;
