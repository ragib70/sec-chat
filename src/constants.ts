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
export type Network = { label: string; chainId: string; rpcUrls: string[], contractAddress?: string };
export const networks: { [key: string]: Network } = {
	"80001": {
		label: "Mumbai",
		chainId: "80001",
		rpcUrls: [
			"https://matic-mumbai.chainstacklabs.com",
			"https://polygon-testnet.public.blastapi.io",
			"https://polygon-mumbai.blockpi.network/v1/rpc/public",
		],
        contractAddress: '0x2BCe067F0a465A351B331240EA91510B6b7C56C8'
	},
	"137": {
		label: "Polygon Mainnet",
		chainId: "137",
		rpcUrls: ["https://polygon-rpc.com	"],
	},
	"3141": {
		label: "Filecoin Hyperspace testnet",
		chainId: "3141",
		rpcUrls: ["https://filecoin-hyperspace.chainstacklabs.com/rpc/v1"],
        contractAddress: '0x8F47376eFE5CA9f9b9641a093FA71436192484A5'
	},
};

export const allowedNetworkIds = ["80001", "3141"];
