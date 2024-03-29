import { useEffect, useRef } from "react";

function useLoadVideoObserver({ dependencyArray, loader }) {
	const containerRef = useRef(null);

	// using useEffect hook
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loader();
				}
			},
			{
				root: null,
				rootMargin: "200px",
			}
		);

		let lastChild = null;

		if (containerRef.current) {
			lastChild = containerRef.current.lastElementChild;
			if (lastChild) {
				observer.observe(lastChild);
			}
		}

		return () => {
			if (lastChild) {
				observer.unobserve(lastChild);
			}
		};
	}, dependencyArray);

	return { containerRef };
}
export default useLoadVideoObserver;
