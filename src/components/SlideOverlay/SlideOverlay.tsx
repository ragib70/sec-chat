import { FC } from "react";
import { Button } from "react-bootstrap";
import "./SlideOverlay.css";

interface SlideOverlayProps {
	show?: boolean;
	onToggle: (show: boolean) => void;
	children?: any;
}

const SlideOverlay: FC<SlideOverlayProps> = (props) => {
	return (
		<div
			className={`slide-overlay border p-1 px-2 shadow-sm rounded position-absolute ${
				props.show ? "slide-overlay-show" : "slide-overlay-hide"
			} bg-white`}
		>
			<div className="d-flex mb-2">
				<div className="me-2">
					<div
						className="p-3 text-muted border-dash"
						hidden={!!props.children}
					>
						Add components.
					</div>
					{props.children}
				</div>
				<div className="ms-auto">
					<Button
						onClick={() => {
							props.onToggle(!props.show);
						}}
						size="sm"
						variant="outline-secondary"
						color="white"
					>
						<i className="bi bi-x-lg"></i>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SlideOverlay;
