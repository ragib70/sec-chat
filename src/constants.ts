export const notifIcons = {
	warning: {
		bsIcon: "exclamation-octagon",
		color: "warning",
	},
	error: {
		bsIcon: "exclamation-triangle",
		color: "danger",
	},
	info: {
		bsIcon: "info-circle",
		color: "info",
	},
};
export type Network = { label: string; chainId: string; rpcUrls: string[] };
export const networks: { [key: string]: Network } = {
	"80001": {
		label: "Mumbai",
		chainId: "80001",
		rpcUrls: [
			"https://matic-mumbai.chainstacklabs.com",
			"https://polygon-testnet.public.blastapi.io",
			"https://polygon-mumbai.blockpi.network/v1/rpc/public",
		],
	},
	"137": {
		label: "Polygon Mainnet",
		chainId: "137",
		rpcUrls: ["https://polygon-rpc.com	"],
	},
	"3141": {
		label: "Filecoin - Mainnet",
		chainId: "3141",
		rpcUrls: ["https://api.hyperspace.node.glif.io/rpc/v1"],
	},
};

export const allowedNetworkIds = ["80001", "3141"];
