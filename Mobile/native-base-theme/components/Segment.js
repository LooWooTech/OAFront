import variable from "./../variables/platform";

export default (variables = variable) => {
	const platform = variables.platform;

	const segmentTheme = {
		height: 45,
		borderColor: variables.segmentBorderColorMain,
		flexDirection: "row",
		justifyContent: "center",
		backgroundColor: variables.segmentBackgroundColor,
		"NativeBase.Button": {
			alignSelf: "center",
			marginTop: 8,
			borderRadius: 0,
			paddingHorizontal: 15,
			height: 30,
			backgroundColor: "transparent",
			borderWidth: 1,
			borderLeftWidth: 0,
			borderColor: variables.segmentBorderColor,
			elevation: 0,
			".active": {
				backgroundColor: variables.segmentActiveBackgroundColor,
				"NativeBase.Text": {
					color: variables.segmentActiveTextColor,
				},
			},
			".first": {
				borderTopLeftRadius: platform === "ios" ? 5 : 5,
				borderBottomLeftRadius: platform === "ios" ? 5 : 5,
				borderLeftWidth: 1,
			},
			".last": {
				borderTopRightRadius: platform === "ios" ? 5 : 5,
				borderBottomRightRadius: platform === "ios" ? 5 : 5,
			},
			"NativeBase.Text": {
				color: variables.segmentTextColor,
				fontSize: 14,
			},
		},
	};

	return segmentTheme;
};
