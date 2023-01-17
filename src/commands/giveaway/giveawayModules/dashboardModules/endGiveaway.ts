import { oneLine, stripIndent, stripIndents } from "common-tags";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ButtonInteraction
} from "discord.js";
import { EMOJIS } from "../../../../constants.js";
import type GiveawayManager from "../../../../database/giveaway.js";
import s from "../../../../helpers/s.js";
import { timestamp } from "../../../../helpers/timestamps.js";
import yesNo from "../../../../helpers/yesNo.js";
import Logger from "../../../../logger/logger.js";
import toDashboard from "../dashboard.js";
import { publishWinners } from "../endModules/publishWinners.js";
import { rollAndSign } from "../endModules/rollWinners/rollAndSign.js";

export default async function toEndGiveaway(
	interaction: ButtonInteraction<"cached">,
	id: number,
	giveawayManager: GiveawayManager
) {
	const giveaway = await giveawayManager.get(id);

	if (!giveaway) {
		await interaction
			.editReply({
				components: [],
				content: stripIndents`
				How did we get here?
			
				${EMOJIS.ERROR} This giveaway does not exist. Try creating one or double-check the ID.
			`,
				embeds: []
			})
			.catch(() => null);

		return;
	}

	const prizesN = giveaway.prizesQuantity();
	const winnersN = giveaway.winnerQuantity;

	if (!prizesN) {
		await interaction
			.followUp({
				ephemeral: true,
				content: stripIndents`
				${EMOJIS.ERROR} This giveaway has no prizes. Add some prizes, and try again.
				
				If the prize(s) are a secret, you can for example name the prize "Secret"
			`
			})
			.catch(() => null);

		return toDashboard(interaction, id);
	}

	let content = stripIndent`
		Are you sure you want to end giveaway #${giveaway.guildRelativeId}?
		
		This will:
		  1. Lock the giveaway.
		  2. Deactivate the giveaway.
		  3. Roll winners.
	`;

	if (giveaway.endTimestamp) {
		const inFuture = Number(giveaway.endTimestamp) < Date.now();

		content += oneLine`
			The giveaway ${inFuture ? "is" : "was"} set to
			end ${timestamp(giveaway.endTimestamp, "R")}.
		`;
	}

	if (prizesN < winnersN) {
		content += "\n\n";
		content += oneLine`
			${EMOJIS.WARN} There are not enough prizes for
			**${winnersN}** ${s("winner", winnersN)}!
			There will be **${prizesN}** ${s("winner", prizesN)} instead.
		`;
	}

	const confirmation = await yesNo({
		filter: (i) => i.user.id === interaction.user.id,
		yesStyle: ButtonStyle.Secondary,
		noStyle: ButtonStyle.Secondary,
		medium: interaction,
		timeActive: 60_000,
		data: {
			components: [],
			content,
			embeds: []
		}
	});

	if (!confirmation) {
		await interaction
			.followUp({
				ephemeral: true,
				content: "Alright! Ending the giveaway was canceled."
			})
			.catch(() => null);

		return toDashboard(interaction, id);
	}

	if (!giveaway.channelId) {
		await interaction.followUp({
			ephemeral: true,
			content: `${EMOJIS.WARN} The giveaway has never been published.`
		});

		return toDashboard(interaction, id);
	}

	await giveaway.publishedMessage?.edit({
		components: [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setLabel("This giveaway has ended!")
					.setStyle(ButtonStyle.Secondary)
					.setCustomId("giveaway-ended")
					.setDisabled(true)
			)
		]
	});

	await giveaway.edit(
		{
			active: false,
			entriesLocked: true
		},
		{
			nowOutdated: {
				publishedMessage: true
			}
		}
	);

	new Logger({
		prefix: "GIVEAWAY",
		color: "red",
		interaction
	}).log(`Ended giveaway #${id}`);

	await rollAndSign({ giveawayId: giveaway.id, guild: interaction.guild });

	const winnerCount = giveaway.winnersUserIds().size;

	const publishWinnersNow = await yesNo({
		filter: (i) => i.user.id === interaction.user.id,
		yesStyle: ButtonStyle.Secondary,
		noStyle: ButtonStyle.Secondary,
		medium: interaction,
		timeActive: 60_000,
		data: {
			components: [],
			embeds: [],
			content: stripIndent`
				Done! Giveaway #${giveaway.guildRelativeId} has ended.
				
				  1. ${EMOJIS.LOCK} Entries are locked.
				  2. ${EMOJIS.INACTIVE} Giveaway is not active.
				  3. ${winnerCount}/${giveaway.winnerQuantity} winners have been rolled.

				Do you want to publish the winners right away?
			`
		}
	});

	if (publishWinnersNow) {
		await publishWinners(interaction, id);

		return;
	}

	await toDashboard(interaction, id);
}
