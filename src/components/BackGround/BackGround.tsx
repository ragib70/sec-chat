import { FC, useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { notifIcons } from "../../constants";
import SlideOverlay from "../SlideOverlay/SlideOverlay";

const BackGround: FC<any> = (props) => {
	const [viewSize, setViewSize] = useState("xl");
	const [notifOverlay, setNotifOverlay] = useState(false);
	const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
	const { setNotification, notification } = useContext(AppContext);
	const handleResize = (e: any) => {
		if (window.innerWidth > 1200) {
			setViewSize("xl");
		} else {
			setViewSize("lg");
		}
	};
	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (!notification) return;
		if (timer) {
			clearTimeout(timer);
			setNotifOverlay(false);
			setTimeout(() => setNotifOverlay(true), 500);
		} else {
			setNotifOverlay(true);
		}

		setTimer(
			setTimeout(() => {
				setNotifOverlay(false);
				setNotification(undefined);
			}, notification.retention || 5000)
		);
	}, [notification]);

	return (
		<div className="w-100 h-100 border position-relative">
			<div className="bg-tape position-absolute"></div>
			<div
				className={`h-100 container-xl ${
					viewSize === "xl" ? "py-5" : ""
				}`}
			>
				{props.children}
			</div>

			<SlideOverlay
				show={notifOverlay}
				onToggle={() => setNotifOverlay(false)}
			>
				{notification && (
					<div className="d-flex p-2" style={{ width: "20rem" }}>
						<div
							className={`text-${
								notifIcons[notification.type].color
							} me-2`}
						>
							<i
								className={`bi bi-${
									notifIcons[notification.type].bsIcon
								}`}
							></i>
						</div>
						<div className="f-80">{notification.message}</div>
					</div>
				)}
			</SlideOverlay>
		</div>
	);
};

export default BackGround;
