export default function calculateHeaderTextColor(backgroundColor) {
	const { r, g, b } = backgroundColor;

	// NOTE: The RGB values provided by Foundry are divided by 255 to give a percentage.
	const perceivedLightness = r * 0.2126 + g * 0.7152 + b * 0.0722;

	return perceivedLightness >= 0.6 ? 'hsl(50, 14%, 9%)' : 'hsl(38, 38%, 94%)';
}
