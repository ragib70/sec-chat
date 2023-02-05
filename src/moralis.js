// import Moralis from 'moralis';
// const ABI = require('./abi.json');
// // const Moralis = require('moralis').default;

// export type ContractMethod = 'declareSpam' | 'depositSPAmount' | 'setApproval' | 'TransferSent' | 'unblock';
// export const triggerContract = (method: ContractMethod, params: {[key: string]: unknown} ) => {
//     return Moralis.start({
//             apiKey: process.env.REACT_APP_MORALIS_KEY
//     })
//     .then(async()=>{
//         const response = await Moralis.EvmApi.utils.runContractFunction({
//             address: `0x243E279c28af8EDd335Ce6A2272b06D2CC1f4c00`,
//             functionName: method,
//             abi: ABI,
//             params: {...params, msgValue: Math.pow(10, 16)},
//         });
//         console.log(response.raw);
//         return response;
//     });
// }


