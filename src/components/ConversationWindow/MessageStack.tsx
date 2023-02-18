import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { AppContext } from "../../App";
import { HomeContext } from "../Home/Home";
import * as PushAPI from "@pushprotocol/restapi";
import { ConversationContext } from "./ConversationWindow";
import { indexOf, uniqueId } from "lodash";
import moment from "moment";
import TextCopy from "../TextCopy/TextCopy";

const MessageStack: FC<any> = ({ wallet }) => {
	const { selectedConversation, setSelectedConversation, selectedTab } =
		useContext(HomeContext);
	const { prvtKey, account } = useContext(AppContext);
	const { messageGroups, setMessageGroups, messages, setMessages } =
		useContext(ConversationContext);
	const [conversationHash, setConversationHash] = useState<
		string | undefined
	>();
	const [messageLoading, setMessageLoading] = useState(false);
    const [execId, setExecId] = useState('0');

	const fetchMessages = useCallback(
		(limit: number = 5, prevMessages: any[] = []) => {
			if (selectedConversation && account && prvtKey) {
				PushAPI.chat
					.conversationHash({
						conversationId: selectedConversation.wallets,
						account: account,
						env: "prod",
					})
					.then((hashResp: any) => {
						setConversationHash(hashResp.threadHash);
						PushAPI.chat
							.history({
								account: account,
								pgpPrivateKey: prvtKey,
								env: "prod",
								threadhash: hashResp.threadHash,
								limit,
							})
							.then((res) => {
								let head = prevMessages.slice(0, limit);
								const tail = prevMessages.slice(
									limit,
									prevMessages.length
								);
								res.reverse().forEach((msg) => {
									if (
										head.findIndex(
											(m) => m.timestamp === msg.timestamp
										) < 0
									) {
										head = [msg, ...head];
									}
								});
								const nextMessages = [...head, ...tail];
								setMessages(nextMessages);
								setMessageLoading(false);
							})
							.catch((err) => {
								console.log(err);
								setMessageLoading(false);
								setMessages([]);
							});
					})
                    .catch((err) =>{
                        console.log(err);
                        setMessageLoading(false);
                    });
			} else {
				setMessages([]);
				setMessageLoading(false);
			}
		},
		[selectedConversation, account, prvtKey, messages]
	);

	useEffect(() => {
		if (!account || !selectedConversation) {
			setMessages([]);
			return;
		}

		setMessageLoading(true);
		fetchMessages(30);
        const interval = setInterval(()=> setExecId(uniqueId()), 10000);
        return () => clearInterval(interval);
	}, [selectedConversation?.wallets, account]);

	useEffect(()=>{
	    fetchMessages(5, messages);
	}, [execId])

	useEffect(() => {
		const dayGroups = messages.reduce((pre: any[], cur) => {
			const dateStr = new Date(cur.timestamp).toDateString();
			if (pre.length === 0) {
				pre.push({
					date: dateStr,
					messages: [cur],
				});
			} else if (pre[pre.length - 1].date !== dateStr) {
				pre[pre.length - 1].userGroups = pre[
					pre.length - 1
				].messages.reduce((p: any[], c: any) => {
					if (
						p.length === 0 ||
						p[p.length - 1].fromCAIP10 !== c.fromCAIP10
					) {
						p.push({
							fromCAIP10: c.fromCAIP10,
							messages: [c],
						});
					} else {
						p[p.length - 1].messages.push(c);
					}
					return p;
				}, []);

				pre.push({
					date: dateStr,
					messages: [cur],
				});
			} else {
				pre[pre.length - 1].messages.push(cur);
			}
			return pre;
		}, []);

		if (dayGroups.length > 0) {
			dayGroups[dayGroups.length - 1].userGroups = dayGroups[
				dayGroups.length - 1
			].messages.reduce((p: any[], c: any) => {
				if (
					p.length === 0 ||
					p[p.length - 1].fromCAIP10 !== c.fromCAIP10
				) {
					p.push({
						fromCAIP10: c.fromCAIP10,
						messages: [c],
					});
				} else {
					p[p.length - 1].messages.push(c);
				}
				return p;
			}, []);
		}

		setMessageGroups(dayGroups);
	}, [messages]);

	// useEffect(()=>{
	//     console.log(messageGroups);
	// }, [messageGroups])
	return (
		<div className="position-relative h-100">
			{selectedConversation && (
				<div
					className="position-absolute py-2 top-0 w-100 bg-white shadow-sm"
					style={{ zIndex: 10 }}
				>
					<div className="d-flex px-2">
						<div style={{ width: "1.5rem", height: "1.5rem" }}>
							<img
								src={`${process.env.PUBLIC_URL}/assets/loader1.svg`}
								alt=""
								hidden={!messageLoading}
								style={{ width: "1.5rem", height: "1.5rem" }}
							/>
						</div>

						<div
							className="d-flex ms-2 align-items-center"
							style={{ width: "calc(100% - 2rem)" }}
						>
							<div className="text-cut me-2 w-75 f-75">
								{(
									selectedConversation?.wallets as string
								).substring(7)}
							</div>
							<div className="">
								<TextCopy
									text={(
										selectedConversation?.wallets as string
									).substring(7)}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
			<div className="message-stack d-flex flex-column-reverse flex-column h-100 overflow-auto pt-5">
				{messageGroups.map((gr1, index) => (
					<div key={`day-group-${index}`}>
						<div className="text-center f-70 position-relative">
							<hr />
							<div
								className="bg-white position-absolute px-2 f-80"
								style={{
									top: "-0.7em",
									left: "calc(50% - 4em)",
								}}
							>
								{gr1.date}
							</div>
						</div>
						<div className="d-flex flex-column-reverse flex-column">
							{(gr1.userGroups as any[]).map(
								(msgGroup, index) => (
									<div key={`message-${index}`} className="">
										<MessageGroup {...msgGroup} />
									</div>
								)
							)}
						</div>
					</div>
				))}
				{/* {
                    messageGroups.map((msgGroup, index) => (
                        <div key={`message-${index}`} className="">
                            <MessageGroup {...msgGroup}/>
                        </div>
                    ))
                } */}
				<div className="mb-auto"> </div>
			</div>
		</div>
	);
};

export default MessageStack;

const MessageGroup: FC<any> = ({ fromCAIP10, messages }) => {
	const { selectedConversation, setSelectedConversation } =
		useContext(HomeContext);
	const { userDetails } = useContext(AppContext);
	const { account } = useContext(AppContext);
	const right = useMemo(
		() => `eip155:${account}`.toLowerCase() === fromCAIP10?.toLowerCase(),
		[account, fromCAIP10]
	);
	return (
		<div
			className={`d-flex flex-row ${
				right ? "flex-row-reverse" : ""
			} py-2`}
		>
			<div className={`${right ? "ps-2" : "pe-2"}`}>
				<img
					className="rounded-pill"
					src={
						right
							? userDetails?.profilePicture
							: selectedConversation?.profilePicture
					}
					alt=""
				/>
			</div>
			<div
				className="d-flex flex-column-reverse flex-column"
				style={{ width: "calc(100% - 2.5em)" }}
			>
				{(messages as any[]).map((msg: any, index) => (
					<div key={`messagelet-${index}`} className="mb-1">
						<MessageLet {...msg} right={right} />
					</div>
				))}
			</div>
		</div>
	);
};

const MessageLet: FC<any> = ({
	messageContent,
	timestamp,
	fromCAIP10,
	toCAIP10,
	right,
}) => {
	return (
		<div className="d-flex">
			<div
				className={`rounded border f-75 p-2 text-wrap ${
					right ? "ms-auto" : "me-auto"
				} overflow-auto`}
				style={{ maxWidth: "20rem" }}
			>
				{messageContent}
				{timestamp && (
					<div className="d-flex f-75 text-muted">
						<div className="ms-auto">
							{moment
								.unix((timestamp as number) / 1000)
								.format("HH:mm")}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
