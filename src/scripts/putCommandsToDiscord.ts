import { Regex } from "#constants";
import { REST } from "@discordjs/rest";
import {
	Routes,
	type RESTPostAPIApplicationCommandsJSONBody
} from "discord.js";
import console from "node:console";
import process from "node:process";
import commands from "./loadCommands.js";

function getCommandData() {
	const rawCommandData = [...new Set(commands.values())];

	return rawCommandData.flatMap(({ data }) =>
		[
			data.chatInput,
			data.contextMenu,
			data.messageContextMenu,
			data.userContextMenu
		].filter(Boolean)
	) as Array<RESTPostAPIApplicationCommandsJSONBody>;
}

export default async function putCommandsToDiscord(
	{ clear }: { clear: boolean } = { clear: false }
) {
	if (!process.env.BOT_TOKEN) {
		throw new TypeError("'BOT_TOKEN' option is not defined in .env");
	}

	if (!process.env.APPLICATION_ID) {
		throw new TypeError("'APPLICATION_ID' option not defined in .env");
	}

	const {
		BOT_TOKEN: token,
		APPLICATION_ID: applicationId,
		GUILD_ID: guildId
	} = process.env;

	if (!Regex.Snowflake.test(applicationId)) {
		throw new TypeError(
			`'APPLICATION_ID' option defined in .env is faulty: ${applicationId}`
		);
	}

	if (guildId && !Regex.Snowflake.test(guildId)) {
		throw new TypeError(
			`'GUILD_ID' option defined in .env is faulty: ${guildId}`
		);
	}

	const rest = new REST().setToken(token);

	const body = clear ? [] : getCommandData();

	const route = guildId
		? Routes.applicationGuildCommands(applicationId, guildId)
		: Routes.applicationCommands(applicationId);

	await rest.put(route, { body });

	console.log(
		`Put ${body.length} commands ${
			guildId ? `in guild: ${guildId}` : "globally"
		}`
	);
}
