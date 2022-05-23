const { SlashCommandBuilder } = require("@discordjs/builders");
const { Modal, TextInputComponent, showModal } = require('discord-modals')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("문의")
        .setDescription("DM HELP 관리자에게 문의사항을 전송합니다."),
    async execute(interaction, client) {
        let modal = new Modal()
            .setCustomId('help-1')
            .setTitle(`관리자에게 문의합니다.`)
            .addComponents([
                new TextInputComponent()
                    .setCustomId('help-input-1')
                    .setStyle('LONG')//장문
                    .setLabel(`문의하실 내용을 입력해주세요.`)
                    .setPlaceholder(`장난식 문의를 하실경우 제제를 받을수 있습니다.`)
                    .setMinLength(1)
                    .setMaxLength(4000)
                    .setRequired(true),
            ]);
        await showModal(modal, {
            client: client,
            interaction: interaction
        })
    },
};