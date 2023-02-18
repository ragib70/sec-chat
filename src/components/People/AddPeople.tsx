import { FC, useCallback, useContext, useState } from "react";
import { AppContext } from "../../App";
import * as PushAPI from "@pushprotocol/restapi";
import { isEmpty, uniqueId } from "lodash";
import { HomeContext } from "../Home/Home";

const AddPeople: FC = () => {
	const { account, setNotification, contract } = useContext(AppContext);
	const {
		setSelectedConversation,
		setPeopleView,
		conversations,
		setConversations,
		setSelectedTab,
	} = useContext(HomeContext);
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>();
	const searchAddress = useCallback(() => {
		if (isEmpty(address)) return;
		setLoading(true);
		PushAPI.user
			.get({
				account: address,
				env: "prod",
			})
			.then((res) => {
				setResult({
					...(res || {
						name: address,
						wallets: `eip155:${address}`,
					}),
					canSend: true,
				});
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				setResult(undefined);
				throw err;
			});
	}, [address]);
	return (
		<div className="p-2">
			<div className="d-flex align-items-center">
				<button
					className="p-1 px-2 bg-thm rounded-pill border-0 me-2"
					onClick={() => setPeopleView("people")}
					disabled={loading}
				>
					<i className="bi bi-arrow-left text-white"></i>
				</button>
				<div className="ms-2 fw-645">Add New</div>
				<div className="ms-auto">
					<img
						src={`${process.env.PUBLIC_URL}/assets/loader1.svg`}
						alt=""
						style={{ width: "1.5rem", height: "1.5rem" }}
						hidden={!loading}
					/>
				</div>
			</div>
			<div className="py-3 d-flex">
				<div className="d-flex w-100 border align-items-center">
					<input
						value={address}
						className="border-0 form-control-custom p-2 f-75 w-100"
						type="text"
						placeholder="Type a message..."
						onChange={(e) => setAddress(e.target.value)}
						onKeyUp={(e) => {
							if (e.key === "Enter") {
								searchAddress();
							}
						}}
					/>
				</div>

				<button
					className="p-2 px-3 bg-thm border-0"
					onClick={() => {
						searchAddress();
					}}
				>
					<i className="bi bi-search text-white"></i>
				</button>
			</div>
			<hr />
			{result && (
				<div className="d-flex align-items-center px-2">
					<div className="pe-2">
						<img
							className="profile-image"
							src={result.profilePicture}
							alt=""
						/>
					</div>
					<div className="middle-block me-2">
						<div className="text-cut w-100 f-80 fw-645">
							{result.name}
						</div>
						{/* <div className="f-75 text-muted text-cut">
                            {wallets}
                        </div> */}
						<div className="f-75 text-muted text-cut">
							{result?.wallets}
						</div>
					</div>
					<button
						className="px-2 bg-thm rounded-pill border-0 me-2"
						onClick={() => {
							const index = conversations.findIndex(
								(conv) =>
									conv.wallets.toLowerCase() ===
									result.wallets.toLowerCase()
							);
							if (index < 0) {
								setLoading(true);
								window.ethereum
									.enable()
									.then(() => {
										contract.methods
											.getSPAmount()
											.call({
												from: account,
											})
											.then((res: any) => {
												// console.log(res);
												contract.methods
													.depositSPAmount(
														(
															(result?.wallets ||
																"") as string
														)
															.toLowerCase()
															.substring(7)
													)
													.send({
														from: account,
														value: parseInt(res),
													})
													.then((res: any) => {
														setLoading(false);
														console.log(res);
														setConversations(
															conversations.concat(
																[result]
															)
														);
														setTimeout(() => {
															setSelectedConversation(
																result
															);
															setSelectedTab(
																"chat"
															);
														}, 300);

														setPeopleView("people");
														setNotification({
															id: uniqueId(),
															message:
																"Amount stacked.",
															type: "info",
														});
													})
													.catch((err: any) => {
														setLoading(false);
														setNotification({
															id: uniqueId(),
															message:
																err.message ||
																"Transaction error!",
															type: "error",
														});
													});
											})
											.catch((err: any) => {
												setLoading(false);
												setNotification({
													id: uniqueId(),
													message:
														err.message ||
														"Get spam amount error!",
													type: "error",
												});
											});
									})
									.catch((err: any) => {
										setLoading(false);
										setNotification({
											id: uniqueId(),
											message:
												err.message ||
												"Transaction error!",
											type: "error",
										});
									});
							} else {
								setSelectedConversation(conversations[index]);
								setPeopleView("people");
							}
						}}
						style={{ height: "2em" }}
						disabled={loading}
					>
						<i className="bi bi-plus-lg text-white"></i>
					</button>
				</div>
			)}
			{!result && <div className="text-center f-80">No Item</div>}
		</div>
	);
};

export default AddPeople;
