import type {
	ApplicationCommandData,
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	ContextMenuCommandInteraction
} from "discord.js";

export type EventFn = (...args: Array<unknown>) => Promise<unknown> | unknown;

export interface EventImport {
	run: EventFn;
}

export type CommandModuleInteractions =
	| AutocompleteInteraction<"cached">
	| ChatInputCommandInteraction<"cached">
	| ContextMenuCommandInteraction<"cached">;

export interface Command {
	data: ApplicationCommandData;
	run(interaction: CommandModuleInteractions): Promise<unknown> | unknown;
}

export interface CommandImport {
	getCommand(): Command;
}
