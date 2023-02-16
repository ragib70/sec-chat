import { FC, useContext, useEffect, useState } from "react";
import { AppContext, AppNotification } from "../../App";
import { notifIcons } from "../../constants";
import SlideOverlay from "../SlideOverlay/SlideOverlay";

const BackGround: FC<any> = (props) => {
	const [viewSize, setViewSize] = useState("xl");
	const [notifOverlay, setNotifOverlay] = useState<{notif?: AppNotification; show: boolean}>({show: false});
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
			setNotifOverlay({...notifOverlay, show: false});
			setTimeout(() => setNotifOverlay({notif: notification, show: true}), 500);
		} else {
			setNotifOverlay({notif: notification, show: true});
		}

		setTimer(
			setTimeout(() => {
				setNotifOverlay({notif: notification, show: false});
				setNotification(undefined);
			}, notification.retention || 20*1000)
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
				show={notifOverlay.show}
				onToggle={(show) => setNotifOverlay({...notifOverlay, show})}
			>
				{notifOverlay.notif && (
					<div className="d-flex p-2" style={{ width: "20rem" }}>
						<div
							className={`text-${
								notifIcons[notifOverlay.notif.type].color
							} me-2`}
						>
							<i
								className={`bi bi-${
									notifOverlay.notif && notifIcons[notifOverlay.notif.type].bsIcon
								}`}
							></i>
						</div>
						<div className="f-80">{notifOverlay.notif?.message}</div>
					</div>
				)}
			</SlideOverlay>
		</div>
	);
};

export default BackGround;
