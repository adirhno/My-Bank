import "rsuite/dist/rsuite.min.css";
import { Progress, ButtonGroup, Button } from "rsuite";
import { useEffect, useState } from "react";

export default function LoadingBar({action}) {
	const [percent, setPercent] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			if (percent >= 100) {
				setPercent(0);
			} else {
				setPercent((p)=>p+1)
			}
		},130);

		return () => {clearInterval(interval)}
	}, [percent]);

	const status = percent === 100 ? "success" : null;
	const color = percent === 100 ? "#03D613" : "#02749C";

	return (
		<div>
			<div
				style={{
					textAlign: "center",
				}}>
				{action == "signIn"?
				<h2>Loading your data, please wait...</h2>:
				<h2>Creating your account, please wait...</h2>}
				<h4
					style={{
						color: "green",
					}}></h4>
			</div>
			<div
				style={{
					padding: 20,
					textAlign: "center",
				}}>
				<div>
					<ButtonGroup></ButtonGroup>
					<hr />
					<Progress.Line
						percent={percent}
						strokeColor={color}
						status={status}
					/>
				</div>
			</div>
		</div>
	);
}
