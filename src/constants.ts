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
        contractAddress: '0x34AD7EA86c7ac94f3314Ac57b38440d7E8535A16'
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
        contractAddress: '0x456ad4E64B4EB52B0D0aEb6d85538794a3462192'
	},
};

export const allowedNetworkIds = ["80001", "3141"];

export const pushApiKey = 'ZaCrOdyBNN.ajF5Igu8ppOfNkxiuiQGoXDyhTkd8sY4gG1v7aa822iVMJSnBE9zp1cXjDgUIPHC';
