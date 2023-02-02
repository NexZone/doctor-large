import { GatewayIntentBits } from "discord.js";
import { type Color } from "./typings/index.js";

export const COMMAND_DIR = new URL("./commands", import.meta.url);
export const EVENT_DIR = new URL("./events", import.meta.url);

export const REGEXP = {
	ACCEPT_PRIZE_CUSTOM_ID: /^accept-prize-(?<id>\d+)$/,
	DASHBOARD_PRIZE_CUSTOM_ID: /^dashboard-prize-(?<id>\d+)/,
	ENTER_GIVEAWAY_CUSTOM_ID: /^enter-giveaway-(?<id>\d+)$/,
	ID: /^\d{17,19}$/
};

// using discord's colours if possible
// <https://discord.com/branding>
export const COLORS = {
	GREEN: "#57F287",
	RED: "#ED4245",
	YELLOW: "#FEE75C"
} as const;

export const EMOJIS = {
	CRY: "😢",
	EDIT: "✍️",
	ENDED: "🔸",
	ENTER_GIVEAWAY_EMOJI: "🎁",
	ERROR: "<:Error:1061984813650804799>",
	GRIN: "😁",
	HALO: "😇",
	HEART_BREAK: "💔",
	HIGHER: "🔺",
	LOCK: "🔒",
	LOWER: "🔻",
	NO_ENTRY: "⛔",
	OFF: "<:Off:1047914155929256026>",
	ON: "<:On:1047914157409828934>",
	PENSIVE: "🥺",
	SHUSH: "🤫",
	SLEEP: "😴",
	SPARKS: "✨",
	STAR_EYES: "🤩",
	SWEAT_SMILE: "😅",
	TADA: "🎉",
	THINK: "🤔",
	UNLOCK: "🔓",
	V: "<:Checkmark:1054081028962136104>",
	WARN: "<:Warning:1061984815781531729>",
	X: "<:Xmark:1054081030107185252>"
} as const;

export const INTENTS: Array<GatewayIntentBits> = [
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.Guilds
];

export const GIVEAWAY = {
	// This will work badly if it is under a minute
	END_HOST_DM_BEFORE_END: 1_800_000, // 30 minutes
	MAX_DESCRIPTION_LEN: 200,
	MAX_DESCRIPTION_LINES: 20,
	MAX_TITLE_LEN: 50,
	MAX_WINNER_QUANTITY_LEN: 2,
	MIN_END_DATE_BUFFER: 600_000 // 10 minutes
} as const;

export const PRIZE = {
	MAX_QUANTITY: 10, // -- MATCH THESE
	MAX_QUANTITY_LEN: 2, // MATCH THESE

	MAX_ADDITIONAL_INFO_LEN: 70,
	MAX_TITLE_LEN: 30
} as const;

export const DEFAULT_LOGGER_PREFIX = "LOG" as const;
export const DEFAULT_LOGGER_COLOR = "yellow" as Color;
