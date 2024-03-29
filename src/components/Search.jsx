import { useState } from "react";
import { useSearchContext } from "../hooks/useSearchContext";
import { Icon } from "./";
import { useNavigate } from "react-router-dom";

const Search = () => {
	//navigate hook
	const navigate = useNavigate();

	// useSearchContext() is a custom hook that returns the value of the SearchContext
	const { setSearchQuery } = useSearchContext();
	// searchInput is the value of the input field
	const [searchInput, setSearchInput] = useState("");

	//function for handling the submit event of the form
	function handleSubmit(e) {
		e.preventDefault();
		setSearchQuery(searchInput.trim());
		navigate("/results");
	}
	return (
		<div className="flex-1 flex max-w-[600px] gap-4">
			{/* control search */}
			<form className="flex-1 flex" onSubmit={handleSubmit}>
				<div className="rounded-full rounded-r-none flex-1 h-full border border-gray-500 px-4 shadow-[inset_0px_1px_3px_-1px_rgba(0,0,0,0.1)] focus-within:shadow-[inset_0px_1px_4px_-1px_rgba(0,0,0,0.3)] focus-within:border-blue-700">
					<input
						type="text"
						placeholder="Search"
						className="w-full h-full bg-transparent placeholder:text-gray-600 focus:outline-none"
						onChange={(e) => setSearchInput(e.target.value)}
					/>
				</div>

				<button className="px-5 rounded-full rounded-l-none border border-gray-500 border-l-0 bg-white-100 hover:bg-gray-200">
					<Icon icon={"magnifier"} />
				</button>
			</form>

			<button className="shrink-0 p-2 bg-gray-50 hover:bg-gray-400 rounded-full">
				<Icon icon={"mic"} />
			</button>
		</div>
	);
};

export default Search;
