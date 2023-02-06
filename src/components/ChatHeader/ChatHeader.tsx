import { FC, useContext, useEffect } from "react";
import { AppContext } from "../../App";
import * as PushAPI from "@pushprotocol/restapi";
import { HomeContext } from "../Home/Home";
import { isEmpty, uniqueId } from "lodash";

const ChatHeader: FC = (props) => {
	const { account, setAccount, prvtKey, setPrvtKey, setNotification } =
		useContext(AppContext);
	const {
		selectedConversation,
		menuCanvas,
		setMenuCanvas,
		setSelectedConversation,
	} = useContext(HomeContext);

	return (
		<div className="h-100 d-flex align-items-center">
			<button
				className="d-block d-lg-none p-1 px-2 rounded-pill bg-thm border-0 me-2"
				onClick={() => setMenuCanvas(!menuCanvas)}
				style={{ zIndex: 11 }}
			>
				<i className="bi bi-list text-white"></i>
			</button>
			<div className="fs-4">SecChat</div>
			{/* <div>
                <button
                    onClick={()=>{
                        // (selectedConversation?.wallets || '').substring(7)
                        
                    }}
                    disabled={!selectedConversation || !account}
                >
                    Call COntract
                </button>
            </div> */}
			<div className="ms-auto">
				<button
					className="rounded-pill px-3 py-1 bg-thm border-0 shadow-sm text-white"
					onClick={async () => {
						if (!prvtKey) {
							try {
								window.ethereum
									.request({
										method: "eth_requestAccounts",
									})
									.then(async (accounts: any) => {
										console.log(accounts);
										if (accounts.length === 0) {
											console.log("no accounts found");
											return null;
										}
										setAccount(accounts[0]);
										PushAPI.user
											.get({
												account: accounts[0],
												env: "prod",
											})
											.then(async (user0) => {
												let pvtkey = null;
												if (
													user0?.encryptedPrivateKey
												) {
													pvtkey =
														await PushAPI.chat.decryptWithWalletRPCMethod(
															user0.encryptedPrivateKey,
															accounts[0]
														);
												}
												if (!isEmpty(pvtkey))
													setPrvtKey(pvtkey);
												else {
													setNotification({
														id: uniqueId(),
														message: `User doesn't exist with address: ${account}. Please authorize user creation.`,
														type: "error",
													});
													PushAPI.user
														.create({
															env: "prod",
															account:
																accounts[0],
														})
														.then(async (user1) => {
															let pvtkey = null;
															if (
																user1?.encryptedPrivateKey
															) {
																pvtkey =
																	await PushAPI.chat.decryptWithWalletRPCMethod(
																		user1.encryptedPrivateKey,
																		accounts[0]
																	);
															}
															if (
																!isEmpty(pvtkey)
															)
																setPrvtKey(
																	pvtkey
																);
														});
												}
											});
									});
							} catch (err) {
								throw Error(
									"LoginError: Etherium is not connected"
								);
							}
						} else {
							setAccount(undefined);
							setPrvtKey(undefined);
							setSelectedConversation(undefined);
							window.localStorage.removeItem("secchat:auth");
							setNotification({
								id: uniqueId(),
								message: "Logout successfull!",
								type: "info",
							});
						}
					}}
				>
					{prvtKey ? "Logout" : "Login"}
				</button>
			</div>
		</div>
	);
};

export default ChatHeader;
