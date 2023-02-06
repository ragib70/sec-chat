import { FC, useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { AppContext } from "../../App";
import { allowedNetworkIds, networks } from "../../constants";

const NetworkOption: FC<{ show: boolean }> = (props) => {
	const { setSelectedNetworkId, selectedNetworkId, setNetworkOption } =
		useContext(AppContext);
	const [error, setError] = useState<any>();
	return (
		<Modal show={props.show}>
			<Modal.Header>
				<div className="d-flex align-items-center w-100">
					<div className="p-2 h5">Select among allowed networks.</div>
					{selectedNetworkId &&
						allowedNetworkIds.includes(selectedNetworkId) && (
							<div className="ms-auto">
								<button
									className="p-1 px-2 border-0 bg-light"
									onClick={() => {
										setNetworkOption(false);
									}}
								>
									<i className="bi bi-x-lg"></i>
								</button>
							</div>
						)}
				</div>
			</Modal.Header>
			<Modal.Body>
				<div hidden={!window.ethereum}>
					{allowedNetworkIds.map((id, index) => (
						<button
							key={`network-option-${id}`}
							className="mb-2 p-2 rounded bg-thm-hover border border-0 d-block w-100 text-start"
							onClick={() => {
								window.ethereum
									.request({
										method: "wallet_switchEthereumChain",
										params: [
											{
												chainId: `0x${parseInt(
													id
												).toString(16)}`,
											},
										],
									})
									.then((res: any) => {
										// setSelectedNetworkId(id);
									})
									.catch((err: any) => {
										console.log(err);
										if (err.code === 4902) {
											window.ethereum
												.request({
													method: "wallet_addEthereumChain",
													params: [
														{
															chainId: `0x${parseInt(
																id
															).toString(16)}`,
															chainName:
																networks[id]
																	.label,
															rpcUrls:
																networks[id]
																	.rpcUrls,
														},
													],
												})
												.then((res: any) => {
													// setSelectedNetworkId(id);
												})
												.catch((err: any) => {
													console.log(err);
													setError(err);
												});
										} else {
											setError(err);
										}
									});
							}}
							disabled={selectedNetworkId === id}
						>
							{networks[id]?.label}
							{selectedNetworkId === id && (
								<i className="bi bi-check text-white-hover ms-4"></i>
							)}
						</button>
					))}
				</div>
                {
                    !window.ethereum && (
                        <div>
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Please install ethereum agent Metamask
                        </div>
                    )
                }
			</Modal.Body>
			{error && (
				<Modal.Footer className="d-block">
					<div className="p-2 text-danger f-80">
						<i className="bi bi-exclamation-triangle text-danger me-2"></i>
						{error.message ||
							"Error occured. visit console for mor info."}
					</div>
				</Modal.Footer>
			)}
		</Modal>
	);
};

export default NetworkOption;
