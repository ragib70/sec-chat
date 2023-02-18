import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { AppContext } from "../../App";
import * as PushAPI from "@pushprotocol/restapi";
import moment from "moment";
import "./People.css";
import { HomeContext } from "../Home/Home";
import { isEmpty, startCase, uniqueId } from "lodash";
import AddPeople from "./AddPeople";

export type PeopleView = "add-new" | "people";

const People: FC = () => {
	const { prvtKey, account, setNotification, selectedNetworkId, contract } =
		useContext(AppContext);
	const {
		selectedConversation,
		setSelectedConversation,
		selectedTab,
		peopleView,
		setPeopleView,
		conversations,
		setConversations,
	} = useContext(HomeContext);

	const [loading, setLoading] = useState(false);
    const [execId, setExecId] = useState('0');
	const fetchPeople = useCallback(
		async (pre: any[]) => {
			if (!account || !prvtKey) {
				setConversations([]);
				return [];
			} else {
				setLoading(true);
				let spams: string[] = [];
				try {
					if (selectedNetworkId) {
						spams = await contract.methods
							.getAllSpamAddresses()
							.call({ from: account });
					}
				} catch (err: any) {
					console.log(err);
					setNotification({
						id: uniqueId(),
						message: err.message || "Contract error!",
						type: "error",
					});
				}
				return (
					selectedTab === "requests" || selectedTab === "spams"
						? PushAPI.chat.requests({
								account: account,
								pgpPrivateKey: prvtKey,
								env: "prod",
						  })
						: PushAPI.chat.chats({
								account: account,
								pgpPrivateKey: prvtKey,
								env: "prod",
						  })
				)
					.then(async (res) => {
						// console.log(res);
						if (selectedTab === "chats") {
							try {
								if (selectedNetworkId) {
									const contractRequests =
										await contract.methods
											.getChatRequestAdresses()
											.call({
												from: account,
											});
									for (let add of contractRequests) {
										const caip = `eip155:${add}`;
										const index = res.findIndex(
											(ch) =>
												ch.fromCAIP10.toLowerCase() ===
													caip.toLowerCase() ||
												ch.toCAIP10.toLowerCase() ===
													caip.toLowerCase()
										);
										if (index < 0) {
											res.push({
												fromCAIP10: caip,
												toCAIP10: "",
												fromDID: caip,
												toDID: "",
												messageType: "Text",
												messageContent: "",
												signature: "",
												sigType: "",
												encType: "",
												encryptedSecret: "",
												link: null,
											});
										}
									}
								}
							} catch (err: any) {
								console.log(err);
								setNotification({
									id: uniqueId(),
									message: err.message || "Contract error",
									type: "error",
								});
							}
						}

						let newConversation: any[] = [];
						if (res.length === 0) {
							setConversations([]);
							setLoading(false);
							return [];
						}
						const reswallets = res.map((m) =>
							m.fromCAIP10.toLowerCase() ===
							`eip155:${account.toLowerCase()}`
								? m.toCAIP10
								: m.fromCAIP10
						);
						const presentCount = reswallets.reduce(
							(p, c) =>
								p +
								(pre.findIndex((p2) => p2.wallets === c) >= 0
									? 1
									: 0),
							0
						);
						if (res.length === presentCount) {
							setLoading(false);
							return pre;
						}

						for (let msg of res) {
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
								let canSend = true;

								if (selectedNetworkId) {
									canSend = await window.ethereum
										.enable()
										.then(() => {
											return contract.methods
												.canSendMessage(
													wallet.substring(7)
												)
												.call({
													from: account,
												});
										})
										.catch((err: any) => {
											console.log(err);
										});
								}

								// console.log('cansend', canSend);
								newConversation.push({
									...res2,
									...msg,
									wallets: wallet,
									canSend,
								});
							} catch (err) {
								console.log(err);
							}
						}

						if (selectedTab === "spams") {
							setConversations(
								newConversation.filter((conv) =>
									spams
										.map((s) => s.toLowerCase())
										.includes(
											(conv.wallets || "")
												.substring(7)
												.toLowerCase()
										)
								)
							);
						} else {
							setConversations(
								newConversation.filter(
									(conv) =>
										!spams
											.map((s) => s.toLowerCase())
											.includes(
												(conv.wallets || "")
													.substring(7)
													.toLowerCase()
											)
								)
							);
						}
						setLoading(false);
						return newConversation;
					})
					.catch((err) => {
						console.log(err);
                        setConversations([]);
						setLoading(false);
					});
			}
		},
		[account, prvtKey, selectedTab, conversations, selectedNetworkId]
	);

	useEffect(() => {
		if (!account) {
            setConversations([]);
		} else {
			fetchPeople([]);
            const interval = setInterval(() => setExecId(uniqueId()), 50000);
            return () => clearInterval(interval);
		}
	}, [account, prvtKey, selectedTab, selectedNetworkId]);

    useEffect(()=>{
        fetchPeople(conversations);
    }, [execId])

	useEffect(() => {
		// console.log(selectedConversation);
		const index = conversations.findIndex(
			(c) => selectedConversation?.wallets === c.wallets
		);
		if (index < 0) return;
		conversations[index].messageContent =
			selectedConversation.messageContent;
		conversations[index].timestamp = selectedConversation.timestamp;
		setConversations([...conversations]);
	}, [selectedConversation]);

    useEffect(()=>{
        if (isEmpty(conversations)){
            setSelectedConversation(undefined);
        }
    }, [conversations])
	return (
		<div className="w-100 h-100">
			{peopleView === "people" && (
				<div className="h-100">
					<div className="d-flex align-items-center">
						<div className="p-2 fw-645">
							{startCase(selectedTab)}
						</div>
						<div className="ms-auto">
							<img
								src={`${process.env.PUBLIC_URL}/assets/loader1.svg`}
								alt=""
								style={{
									width: "1.5rem",
									height: "1.5rem",
								}}
								hidden={!loading}
							/>
						</div>
						<button
							className="ms-2 px-2 bg-thm rounded-pill border-0 me-2"
							onClick={() => {
								setPeopleView("add-new");
								setSelectedConversation(undefined);
							}}
							style={{ height: "2em" }}
						>
							<i className="bi bi-plus-lg text-white"></i>
						</button>
					</div>
					<div
						className="overflow-auto pb-3"
						style={{ height: "calc(100% - 2rem" }}
					>
						{conversations.map((conv, index) => (
							<div
								key={`conv-${index}`}
								className="border-bottom border-top cursor-pointer"
								onClick={() => setSelectedConversation(conv)}
							>
								<UserItem
									{...conv}
									selected={
										selectedConversation?.wallets ===
										conv.wallets
									}
								/>
							</div>
						))}
					</div>
				</div>
			)}
			{peopleView === "add-new" && (
				<div>
					<AddPeople />
				</div>
			)}
		</div>
	);
};

export default People;

export const UserItem: FC<any> = ({
	wallets,
	name,
	timestamp,
	profilePicture,
	messageContent,
	selected,
}) => {
	const { setSelectedConversation } = useContext(HomeContext);
	return (
		<div className="d-flex">
			<div className={`left-bar ${selected ? "bg-thm" : ""}`}></div>
			<div className="user-container">
				<div className="inner-content d-flex">
					<div className="pe-2">
						<img
							className="profile-image"
							src={profilePicture}
							alt=""
						/>
					</div>
					<div className="middle-block me-2">
						<div className="text-cut w-100 f-80 fw-645">
							{wallets}
						</div>
						{/* <div className="f-75 text-muted text-cut">
                            {wallets}
                        </div> */}
						<div className="f-75 text-muted text-cut">
							{messageContent}
						</div>
					</div>
					{timestamp && (
						<div className="ms-auto right-block f-75 text-muted">
							{moment
								.unix((timestamp as number) / 1000)
								.format("HH:mm")}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
