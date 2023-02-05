import { useCallback, useState } from "react";

export const useRepeatQuery = (props: {
	query: () => Promise<any>;
	repeat: number;
}) => {
	const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const start = useCallback(() => {
		if (timer) clearTimeout(timer);
		setLoading(true);
		props
			.query()
			.then((res) => {
				setLoading(false);
				setTimer(setTimeout(start, props.repeat || 5000));
			})
			.catch((err) => {
				setLoading(false);
				throw err;
			});
	}, [props, timer]);
	return {
		start,
		loading,
		stop: () => {
			if (timer) clearTimeout(timer);
		},
	};
};
