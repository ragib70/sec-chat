import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { AppContext } from "../../App";
import { HomeContext } from "../Home/Home";
import { ConversationContext } from "./ConversationWindow";
import * as PushAPI from "@pushprotocol/restapi";
import { isEmpty, uniqueId } from "lodash";
import { pushApiKey } from "../../constants";

const Compose: FC = (props) => {
	const { prvtKey, account, setNotification } = useContext(AppContext);
	const { selectedConversation, setSelectedConversation } =
		useContext(HomeContext);
	const {
		messageGroups,
		messages,
		setMessages,
		setMessageGroups,
		inBufferMessessages,
		setInBufferMessages,
		setsendQuery,
		sendQuery,
	} = useContext(ConversationContext);
	const { userDetails } = useContext(AppContext);
	const inputRef = useRef<HTMLInputElement>(null);
	const [textInput, setTextInput] = useState("");
	useEffect(() => {
		if (inBufferMessessages.length === 0 || !account || !prvtKey) {
			setsendQuery({ running: false });
			return;
		}
		setsendQuery({ running: true });
		PushAPI.chat
			.send({
				messageContent: inBufferMessessages[0].messageContent,
				messageType: "Text",
				receiverAddress: inBufferMessessages[0].toCAIP10,
				pgpPrivateKey: prvtKey,
				account: account,
				apiKey: pushApiKey,
				env: "prod",
			})
			.then((res) => {
				if (
					inBufferMessessages[0].toCAIP10 ===
					selectedConversation.wallets
				) {
					// if (messageGroups.length ===0 || messageGroups[0].fromCAIP10 !== userDetails.wallets){
					//     setMessageGroups([{
					//         fromCAIP10: userDetails.wallets,
					//         messages: [inBufferMessessages[0]]
					//     }, ...messageGroups])
					// }else{
					//     messageGroups[0].messages = [inBufferMessessages[0], ...messageGroups[0].messages];
					//     setMessageGroups([...messageGroups]);
					// }
					// setMessages([inBufferMessessages[0], ...messages]);
				}
				setSelectedConversation({
					...selectedConversation,
					messageContent: inBufferMessessages[0].messageContent,
					timestamp: inBufferMessessages[0].timestamp,
				});
				setInBufferMessages(
					inBufferMessessages.slice(1, inBufferMessessages.length - 1)
				);
			})
			.catch((err) => {
				setsendQuery({ running: false });
				setNotification({
					id: uniqueId(),
					message: err.message || "Error sending message!",
					type: "error",
				});
				// setInBufferMessages([...inBufferMessessages]);
			});
	}, [inBufferMessessages]);

	const pushInBuffer = useCallback(
		(text: string) => {
			if (isEmpty(text.trim()) || !selectedConversation || !selectedConversation?.canSend) return;
			const newMessage = {
				fromCAIP10: userDetails.wallets,
				timestamp: new Date().getTime(),
				messageContent: text,
				toCAIP10: selectedConversation.wallets,
				stage: "queued",
			};
			setInBufferMessages([...inBufferMessessages, newMessage]);
			setTextInput("");
		},
		[userDetails, selectedConversation, inBufferMessessages]
	);

	useEffect(() => {
		setInBufferMessages([]);
	}, [prvtKey]);

	return (
		<div className="py-3">
			<div className="d-flex">
				<div className="d-flex w-100 border align-items-center">
					<input
						value={textInput}
						className="border-0 form-control-custom p-2 f-75 w-100"
						type="text"
						placeholder="Type a message..."
						onChange={(e) => setTextInput(e.target.value)}
						onKeyUp={(e) => {
							if (e.key === "Enter") {
								pushInBuffer(textInput);
							}
						}}
                        disabled={!selectedConversation?.canSend}
					/>
					<div className="pt-1" style={{ width: "2em" }}>
						<div
							className="spinner-border f-80"
							style={{
								width: "2em",
								height: "2em",
								color: "grey",
							}}
							hidden={!sendQuery.running}
						></div>
					</div>
				</div>

				<button
					className="p-2 px-3 bg-thm border-0"
					onClick={() => {
						pushInBuffer(textInput);
					}}
					disabled={!selectedConversation?.canSend}
				>
					<i className="bi bi-send text-white"></i>
				</button>
			</div>
            {
                !selectedConversation?.canSend && 
                <div className="text-danger f-80 my-1">
                    <i className="bi bi-exclamation-triangle me-2 text-danger"></i>
                    Can't send message. You have been blocked by the reciever!
                </div>
            }
		</div>
	);
};

export default Compose;
