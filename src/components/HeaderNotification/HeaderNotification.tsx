import {
	FC,
	useCallback,
	useRef,
	useState,
	useContext,
	useEffect,
} from "react";
import { ABI, AppContext, web3 } from "../../App";
import * as PushAPI from "@pushprotocol/restapi";
import { allowedNetworkIds, networks } from "../../constants";

interface HeaderNotificationProps {}

const HeaderNotification: FC = (props) => {
	const { account, prvtKey, selectedNetworkId } = useContext(AppContext);
	const [showNotif, setShowNotif] = useState(false);
	const [notif, setNotif] = useState<{ data: any[] }>({
		data: [],
	});
	const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
	const notifToggleRef = useRef<HTMLDivElement>(null);

	const refreshNotif = useCallback(() => {
		if (!account) return;
		PushAPI.chat
			.requests({
				account: account,
				pgpPrivateKey: prvtKey,
				env: "prod",
			})
			.then(async (req) => {
				let newRequests: any[] = [];
				for (let msg of req) {
					const wallet =
						msg.fromCAIP10.toLowerCase() ===
						`eip155:${account.toLowerCase()}`
							? msg.toCAIP10
							: msg.fromCAIP10;
					try {
						const res2 = await PushAPI.user.get({
							account: wallet,
							env: "prod",
						});
						newRequests.push({
							...res2,
							...msg,
							wallets: wallet,
						});
					} catch (err) {
						console.log(err);
					}
				}
				for (let netId of allowedNetworkIds) {
					const netContract = new web3.eth.Contract(
						ABI,
						networks[netId].contractAddress
					);
					let netRequests = [];
					try {
						netRequests = await netContract.methods
							.getReceiversChatRequestAdresses()
							.call({
								from: account,
							});
					} catch (err) {
						console.log(`error with net: ${netId}`, err);
					}
					for (let req of netRequests) {
						newRequests.map((r) =>
							r.wallets.toLowerCase() ===
							`eip155:${(req as string).toLowerCase()}`
								? { ...r, netId }
								: r
						);
					}
				}

				setNotif({ ...notif, data: newRequests });
				setTimer(setTimeout(refreshNotif, 60 * 1000));
			});
	}, [account]);

	useEffect(() => {
		if (timer) clearTimeout(timer);
		if (!account || !selectedNetworkId) {
			setNotif({ data: [] });
			return;
		}
		setTimer(setTimeout(refreshNotif, 100));
	}, [account, selectedNetworkId]);

	const handleWindowClick = (e: any) => {
		if (notifToggleRef.current?.contains(e.target)) {
		} else {
			setShowNotif(false);
		}
	};
	useEffect(() => {
		window.addEventListener("click", handleWindowClick);
		return () => {
			window.removeEventListener("click", handleWindowClick);
		};
	}, []);
	return (
		<div ref={notifToggleRef} className="dropdown ms-auto me-2">
			<button
				className="px-2 py-1 bg-thm rounded-pill border-0 position-relative"
				onClick={() => {
					setShowNotif(!showNotif);
				}}
			>
				<i className="bi bi-bell text-white"></i>
				<div
					className="position-absolute"
					style={{ top: "0px", left: "20px" }}
				>
					<div className="d-flex">
						{notif.data.length > 0 && (
							<div
								className=" rounded-pill bg-warning"
								style={{
									width: "10px",
									height: "10px",
								}}
							></div>
						)}
					</div>
				</div>
				<div
					className="position-absolute"
					style={{ top: "bottom", left: "50%" }}
				>
					<div
						className="text-mured rounded-pill border ms-1 px-1 shadow-sm"
						style={{ fontSize: "50%" }}
					>
						Beta
					</div>
				</div>
			</button>
			<div
				className={`dropdown-menu ${showNotif ? "show" : ""} py-2`}
				style={{ right: 0 }}
			>
				{notif.data.map((req, index) => (
					<div
						key={`request-notif-${index}`}
						className={`d-flex p-2 align-items-center f-80 ${
							index % 2 ? "bg-light" : ""
						}`}
						style={{ width: "15em" }}
					>
						<div className="w-50 text-cut">
							{req.wallets.substring(7)}
						</div>
						<div className="ms-2 border text-muted">
							{req.netId || "unknow"}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default HeaderNotification;
