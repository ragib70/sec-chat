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
        contractAddress: '0x4E6724E99083Cd5bC6b566FbEB15C72f748463fe'
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
        contractAddress: '0xD2D8019dC3D7D4258b9e53BFACFbe8517c47c79e'
	},
    "5001": {
        label: 'Mantle Testnet',
        chainId: '5001',
        rpcUrls: ["https://rpc.testnet.mantle.xyz"],
        contractAddress: '0x0e9dF147be69EfA819d5d3C6859B3b4d34a7CbA0'
    }
};

export const allowedNetworkIds = ["80001", "3141", "5001"];

export const pushApiKey = 'ZaCrOdyBNN.ajF5Igu8ppOfNkxiuiQGoXDyhTkd8sY4gG1v7aa822iVMJSnBE9zp1cXjDgUIPHC';
