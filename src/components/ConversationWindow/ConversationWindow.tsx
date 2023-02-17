import { createContext, FC, useContext, useState } from "react";
import { HomeContext } from "../Home/Home";
import Compose from "./Compose";
import MessageStack from "./MessageStack";
import * as PushAPI from "@pushprotocol/restapi";
import { AppContext } from "../../App";
import { uniqueId } from "lodash";
import React from "react";

export const ConversationContext = createContext<{
	messages: Array<any>;
	setMessages: React.Dispatch<React.SetStateAction<any[]>>;
	messageGroups: Array<any>;
	setMessageGroups: React.Dispatch<React.SetStateAction<any[]>>;
	sendQuery: { running: boolean };
	setsendQuery: React.Dispatch<React.SetStateAction<{ running: boolean }>>;
	inBufferMessessages: any[];
	setInBufferMessages: React.Dispatch<React.SetStateAction<any[]>>;
}>({
	messages: [],
	setMessages: () => {},
	messageGroups: [],
	setMessageGroups: () => {},
	sendQuery: { running: false },
	setsendQuery: () => {},
	inBufferMessessages: [],
	setInBufferMessages: () => {},
});

const ConversationWindow: FC = (props) => {
	const { setNotification, contract } = useContext(AppContext);
	const [messageGroups, setMessageGroups] = useState<Array<any>>([]);
	const [messages, setMessages] = useState<Array<any>>([]);
	const [sendQuery, setsendQuery] = useState<{ running: boolean }>({
		running: false,
	});
	const [inBufferMessessages, setInBufferMessages] = useState<Array<any>>([]);
	const {
		selectedTab,
		setSelectedTab,
		selectedConversation,
		setSelectedConversation,
		peopleView,
		conversations,
		setConversations,
	} = useContext(HomeContext);
	const { account } = useContext(AppContext);
	const [approveLoading, setApproveLoading] = useState(false);
	const [spamLoading, setSpamLoading] = useState(false);

	return (
		<ConversationContext.Provider
			value={{
				messageGroups,
				setMessageGroups,
				sendQuery,
				setsendQuery,
				inBufferMessessages,
				setInBufferMessages,
				messages,
				setMessages,
			}}
		>
			<div className="h-100 w-100">
				<div className="message-box px-4">
					<MessageStack />
				</div>
				<div
					className="mt-auto compose-window border-top px-4"
					hidden={
						["requests", "spams"].includes(selectedTab) ||
						peopleView === "add-new" ||
						!selectedConversation
					}
				>
					<Compose />
				</div>
				{["requests", "spams"].includes(selectedTab) &&
					selectedConversation && (
						<div className="d-flex border-top pt-3 px-2">
							{selectedTab === "requests" && (
								<React.Fragment>
									<button
										className="ms-auto rounded-pill px-3 py-1 bg-danger border-0 shadow-sm text-white"
										disabled={approveLoading}
										style={{ width: "8em" }}
										onClick={() => {
											if (
												!selectedConversation ||
												!account
											)
												return;
											setSpamLoading(true);
											contract.methods
												.declareSpam(
													(
														selectedConversation?.wallets ||
														""
													).substring(7)
												)
												.send({
													from: account,
												})
												.then((res: any) => {
													console.log(res);
													setSpamLoading(false);
													setSelectedTab("chats");
													setConversations(
														conversations.map((c) =>
															c.wallets ===
															selectedConversation?.wallets
																? {
																		...c,
																		canSend:
																			false,
																  }
																: c
														)
													);
													setSelectedConversation(
														undefined
													);
												})
												.catch((err: any) => {
													setSpamLoading(false);
													console.log(err);
													setNotification({
														id: uniqueId(),
														message:
															err.message ||
															"Error from contract",
														type: "error",
													});
												});
										}}
									>
										<span
											className=" text-white"
											hidden={spamLoading}
										>
											Mark spam
										</span>
										<img
											src={`${process.env.PUBLIC_URL}/assets/loader2.svg`}
											alt=""
											hidden={!spamLoading}
											style={{
												width: "1.5rem",
												height: "1.5rem",
												color: "white",
											}}
										/>
									</button>
									<button
										className="ms-2 rounded-pill px-3 py-1 bg-thm border-0 shadow-sm"
										style={{ width: "8em" }}
										onClick={() => {
											if (!account) return;
											setApproveLoading(true);
											contract.methods
												.setApproval(
													(
														selectedConversation?.wallets ||
														""
													).substring(7)
												)
												.send({
													from: account,
												})
												.then(() => {
													PushAPI.chat
														.approve({
															account,
															senderAddress:
																selectedConversation?.wallets,
															status: "Approved",
														})
														.then((res) => {
															setConversations([
																...conversations,
																selectedConversation,
															]);
															setSelectedTab(
																"chats"
															);
                                                            setTimeout(() => setSelectedConversation(
																selectedConversation
															), 500);
															setApproveLoading(
																false
															);
														});
												})
												.catch((err: any) => {
													console.log(err);
													setApproveLoading(false);
													setNotification({
														id: uniqueId(),
														message:
															err.message ||
															"Error occured",
														type: "error",
													});
												});
										}}
										disabled={spamLoading}
									>
										<span
											className="text-white"
											hidden={approveLoading}
										>
											Approve
										</span>
										<img
											src={`${process.env.PUBLIC_URL}/assets/loader2.svg`}
											alt=""
											hidden={!approveLoading}
											style={{
												width: "1.5rem",
												height: "1.5rem",
												color: "white",
											}}
										/>
									</button>
								</React.Fragment>
							)}
							{selectedTab === "spams" && (
								<button
									className="ms-auto rounded-pill px-3 py-1 bg-thm border-0 shadow-sm"
									style={{ width: "8em" }}
									onClick={async () => {
										if (!selectedConversation || !account)
											return;
										setSpamLoading(true);
										const returnAmount =
											await contract.methods
												.conversationGraph(
													(
														selectedConversation?.wallets ||
														""
													).substring(7),
													account
												)
												.call({
													from: account,
												})
												.catch((err: any) => {
													setSpamLoading(false);
													console.log(err);
													setNotification({
														id: uniqueId(),
														message:
															err.message ||
															"Error from contract",
														type: "error",
													});
												});
										contract.methods
											.undeclareSpam(
												(
													selectedConversation?.wallets ||
													""
												).substring(7)
											)
											.send({
												from: account,
												value:
													returnAmount.amountDeposited ||
													0,
											})
											.then((res: any) => {
												PushAPI.chat
													.approve({
														account,
														senderAddress:
															selectedConversation?.wallets,
														status: "Approved",
													})
													.then((res) => {
														setSpamLoading(false);
														// setSelectedTab('chats');
														setConversations(
															conversations.filter(
																(c) =>
																	c.wallets !==
																	selectedConversation?.wallets
															)
														);
														setSelectedConversation(
															undefined
														);
														setApproveLoading(
															false
														);
													})
													.catch((err: any) => {
														setSpamLoading(false);
														console.log(err);
														setNotification({
															id: uniqueId(),
															message:
																err.message ||
																"Error from push api.",
															type: "error",
														});
													});
											})
											.catch((err: any) => {
												setSpamLoading(false);
												console.log(err);
												setNotification({
													id: uniqueId(),
													message:
														err.message ||
														"Error from contract",
													type: "error",
												});
											});
									}}
									disabled={spamLoading}
								>
									<span
										className="text-white"
										hidden={spamLoading}
									>
										Unspam
									</span>
									<img
										src={`${process.env.PUBLIC_URL}/assets/loader2.svg`}
										alt=""
										hidden={!spamLoading}
										style={{
											width: "1.5rem",
											height: "1.5rem",
											color: "white",
										}}
									/>
								</button>
							)}
						</div>
					)}
			</div>
		</ConversationContext.Provider>
	);
};

export default ConversationWindow;
