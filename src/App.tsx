import "./App.css";
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import { createContext, useEffect, useState } from "react";
import { chat, user } from "@pushprotocol/restapi";
import { Provider } from "react-redux";
import { store } from "./app/store";
import BackGround from "./components/BackGround/BackGround";
import Home from "./components/Home/Home";
import { uniqueId } from "lodash";
import Web3 from "web3";
import { allowedNetworkIds, networks } from "./constants";
import NetworkOption from "./components/NetworkOption/NetworkOption";

const ABI = require("./abi.json");
const web3 = new Web3(window.ethereum);

export interface AppNotification {
	id: string;
	message: string;
	type: "warning" | "error" | "info";
	retention?: number;
}

export const AppContext = createContext<{
	contract: any;
	selectedNetworkId: string | undefined;
	setSelectedNetworkId: React.Dispatch<
		React.SetStateAction<string | undefined>
	>;
	prvtKey: string | undefined;
	setPrvtKey: React.Dispatch<React.SetStateAction<string | undefined>>;
	account: string | undefined;
	setAccount: React.Dispatch<React.SetStateAction<string | undefined>>;
	userDetails: any;
	setUserDetails: React.Dispatch<React.SetStateAction<any>>;
	notification: AppNotification | undefined;
	setNotification: React.Dispatch<
		React.SetStateAction<AppNotification | undefined>
	>;
	setNetworkOption: React.Dispatch<React.SetStateAction<boolean>>;
}>({
    contract: undefined,
	selectedNetworkId: undefined,
	setSelectedNetworkId: () => {},
	prvtKey: undefined,
	setPrvtKey: () => {},
	account: undefined,
	setAccount: () => {},
	userDetails: undefined,
	setUserDetails: () => {},
	notification: undefined,
	setNotification: () => {},
	setNetworkOption: () => {},
});

function App() {
	const authCache = JSON.parse(
		window.localStorage.getItem("secchat:auth") || "{}"
	);
	const [prvtKey, setPrvtKey] = useState<string | undefined>(
		authCache.prvtKey
	);
	const [account, setAccount] = useState<string | undefined>(
		authCache.account
	);
	const [userDetails, setUserDetails] = useState<any>(authCache.account);
	const [notification, setNotification] = useState<
		AppNotification | undefined
	>();
	const [selectedNetworkId, setSelectedNetworkId] = useState<
		string | undefined
	>();
	const [networkOption, setNetworkOption] = useState(false);
	const [contract, setContract] = useState<any>();

	useEffect(() => {
		window.localStorage.setItem(
			"secchat:auth",
			JSON.stringify({
				account,
				prvtKey,
			})
		);
	}, [account, prvtKey]);

	useEffect(() => {
		if (!account || !prvtKey) {
			setUserDetails(undefined);
			return;
		}
		PushAPI.user
			.get({
				account,
				env: "prod",
			})
			.then((res) => {
				setUserDetails(res);
				setNotification({
					id: uniqueId(),
					message: "Login successfull!",
					type: "info",
				});
			});
	}, [prvtKey]);

	const handleNetworkChange = (chainId: string) => {
		console.log("swithced to: ", chainId);
		const decimalString = parseInt(chainId, 16).toString();
		if (!chainId || !allowedNetworkIds.includes(decimalString)) {
			setNetworkOption(true);
			setSelectedNetworkId(undefined);
		} else {
			setNetworkOption(false);
			setSelectedNetworkId(decimalString);
            console.log(networks[decimalString].contractAddress)
			setContract(
				new web3.eth.Contract(
					ABI,
					networks[decimalString].contractAddress
				)
			);
		}
	};
	useEffect(() => {
		// method: net_version, would give decimal string for chaninId
		if (!window.ethereum) {
			setNetworkOption(true);
		} else {
			window.ethereum
				.request({ method: "eth_chainId" })
				.then(handleNetworkChange)
				.catch((err: any) => {
					console.log(err);
					setNetworkOption(true);
				});
			window.ethereum.on("chainChanged", handleNetworkChange);

			return () => {
				window.ethereum.removeListener(
					"chainChanged",
					handleNetworkChange
				);
			};
		}
	}, []);
	return (
		<Provider store={store}>
			<AppContext.Provider
				value={{
					prvtKey,
					setPrvtKey,
					account,
					setAccount,
					userDetails,
					setUserDetails,
					setNotification,
					notification,
					selectedNetworkId,
					setSelectedNetworkId,
					setNetworkOption,
					contract,
				}}
			>
				<BackGround>
					<Home />
					<NetworkOption show={networkOption} />
				</BackGround>
			</AppContext.Provider>
		</Provider>
	);
}

export default App;
