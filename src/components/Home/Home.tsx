import { createContext, FC, useEffect, useState } from "react";
import ChatHeader from "../ChatHeader/ChatHeader";
import ConversationWindow from "../ConversationWindow/ConversationWindow";
import People, { PeopleView } from "../People/People";
import Sidebar from "../SideBar/SideBar";

export const HomeContext = createContext<{
    conversations: any[];
	setConversations: React.Dispatch<React.SetStateAction<any[]>>;
	selectedConversation: any;
	setSelectedConversation: React.Dispatch<React.SetStateAction<undefined>>;
	menuCanvas: boolean;
	setMenuCanvas: React.Dispatch<React.SetStateAction<boolean>>;
	selectedTab: string;
	setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
	peopleView: PeopleView;
	setPeopleView: React.Dispatch<React.SetStateAction<PeopleView>>;
}>({
    conversations: [],
	setConversations: () => {},
	selectedConversation: undefined,
	setSelectedConversation: () => {},
	menuCanvas: false,
	setMenuCanvas: () => {},
	selectedTab: "chats",
	setSelectedTab: () => {},
	peopleView: "people",
	setPeopleView: () => {},
});

const Home: FC = () => {
	const [peopleCanvas, setPeopleCanvas] = useState(false);
	const [menuCanvas, setMenuCanvas] = useState(false);
	const [selectedConversation, setSelectedConversation] = useState<any>();
	const [selectedTab, setSelectedTab] = useState("chats");
	const [peopleView, setPeopleView] = useState<PeopleView>("people");
    const [conversations, setConversations] = useState<any[]>([]);

	useEffect(() => {
		if (menuCanvas && peopleCanvas) {
			setPeopleCanvas(false);
		}
	}, [menuCanvas]);

	useEffect(() => {
		if (menuCanvas && peopleCanvas) {
			setMenuCanvas(false);
		}
	}, [peopleCanvas]);

	useEffect(() => {
		setPeopleCanvas(true);
		setSelectedConversation(undefined);
	}, [selectedTab]);

	return (
		<HomeContext.Provider
			value={{
				selectedConversation,
				setSelectedConversation,
				menuCanvas,
				setMenuCanvas,
				setSelectedTab,
				selectedTab,
				peopleView,
				setPeopleView,
                conversations,
                setConversations
			}}
		>
			<div className="h-100 border bg-white row flex-nowrap shadow rounded-4 position-relative">
				<div className="left-menu h-100 d-none d-lg-block col-3 p-0 py-3">
					<Sidebar />
				</div>
				<div
					className={`people-canvas h-100 d-block d-lg-none ${
						menuCanvas ? "people-canvas-show" : ""
					} h-100 position-absolute bg-white p-0`}
					style={{ zIndex: 11 }}
				>
					<div
						className="shadow-sm h-100"
						style={{ paddingTop: "5em" }}
					>
						<Sidebar />
					</div>
				</div>

				<div className="chat-window col col-lg-9 h-100 p-0">
					<div className="window-header">
						<ChatHeader />
					</div>
					<div className="window-body">
						<div
							className="h-100 bg-white d-flex"
							// style={{borderRadius: '1em'}}
						>
							{/* <div className="people h-100 d-none d-lg-block">
                                <People />
                            </div> */}
							<div
								className={`people-canvas ${
									peopleCanvas ? "people-canvas-show" : ""
								} h-100`}
							>
								<People />
							</div>
							<div
								className={`h-100 position-relative ${
									peopleCanvas
										? "conversation-split"
										: "conversation"
								}`}
							>
								<div
									className="rounded-pill people-toggle position-absolute shadow bg-thm overflow-hidden"
									style={{ top: "5em", left: "-1em" }}
								>
									<button
										className="border-0 bg-thm text-white"
										onClick={() => {
											setPeopleCanvas(!peopleCanvas);
										}}
										style={{ width: "2em", height: "2em" }}
									>
										<i
											className={`bi bi-${
												peopleCanvas
													? "caret-left"
													: "caret-right"
											} text-white`}
										></i>
									</button>
								</div>
								<ConversationWindow />
							</div>
						</div>
					</div>
				</div>
			</div>
		</HomeContext.Provider>
	);
};

export default Home;
