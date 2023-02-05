import app from '../client/slack'
import { getAllTeams, getTeam } from '../queries/team'

interface createTeamModalProps {
	trigger_id: string
	user_id: string
}

const createTeamModal = async ({
	trigger_id,
}: createTeamModalProps) => {
	const alreadyCreatedTeams = await getAllTeams()

	await app.client.views.open({
		trigger_id,
		view: {
			callback_id: 'create-team-modal',
			type: 'modal',
			title: {
				type: 'plain_text',
				text: 'Start celebrating days',
				emoji: true,
			},
			submit: {
				type: 'plain_text',
				text: 'Create Team',
				emoji: true,
			},
			close: {
				type: 'plain_text',
				text: 'Cancel',
				emoji: true,
			},
			blocks: [
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: "Birthday Buddy collects your coworkers' birthdays and anniversaries and supports you to celebrate together! \n\n To start, pick a channel where wishes will be posted. \n Every member of the channel can share their anniversaries and participate in the celebration.",
					},
				},
				{
					type: 'divider',
				},
				{
					type: 'input',
					block_id: 'input-name',
					element: {
						type: 'plain_text_input',
						action_id: 'team-name',
					},
					label: {
						type: 'plain_text',
						text: 'Name',
						emoji: true,
					},
				},
				{
					type: 'input',
					block_id: 'input-channel',
					element: {
						type: 'conversations_select',
						action_id: 'team-channel',
						filter: {
							include: ['public'],
						},
					},
					label: {
						type: 'plain_text',
						text: 'Set a channel',
						emoji: true,
					},
				},
			],
		},
	})
}

const editTeamModal = async ({
	trigger_id,
	team_id,
}: {
	trigger_id: string
	team_id: string
}) => {
	const team = await getTeam({ team_id })
	if (!team) return

	await app.client.views.open({
		trigger_id,
		view: {
			type: 'modal',
			callback_id: 'edit-team-modal',
			private_metadata: team_id,
			title: {
				type: 'plain_text',
				text: 'Edit team',
				emoji: true,
			},
			submit: {
				type: 'plain_text',
				text: 'Update',
				emoji: true,
			},
			close: {
				type: 'plain_text',
				text: 'Cancel',
				emoji: true,
			},
			blocks: [
				{
					type: 'input',
					block_id: 'input-name',
					element: {
						type: 'plain_text_input',
						action_id: 'team-name',
						initial_value: team.name,
					},
					label: {
						type: 'plain_text',
						text: 'Name',
						emoji: true,
					},
				},
				{
					type: 'input',
					block_id: 'input-channel',
					element: {
						initial_conversation: team.team_id,
						type: 'conversations_select',
						action_id: 'team-channel',
						filter: {
							include: ['public'],
						},
					},
					label: {
						type: 'plain_text',
						text: 'Set a channel',
						emoji: true,
					},
				},
				{
					type: 'divider',
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: ':warning: *Dangerous Area* \n Do you want to remove this team? \n This action is irreversible. ',
					},
					accessory: {
						type: 'button',
						text: {
							type: 'plain_text',
							text: 'Delete',
							emoji: true,
						},
						style: 'danger',
						value: team_id,
						action_id: 'delete-team-action',
					},
				},
			],
		},
	})
}

export { createTeamModal, editTeamModal }