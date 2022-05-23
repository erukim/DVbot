const { MessageEmbed } = require("discord.js")
const { Modal, TextInputComponent, showModal } = require('discord-modals')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("답변")
        .setDescription("DM HELP 관리자가 문의한 유저에게 답장을 전송합니다."),
    async execute(interaction, client) {
        if (interaction.user.id == '967816978683265025' || interaction.user.id == "939349343431954462") {
            let modal = new Modal()
                .setCustomId('reply-1')
                .setTitle(`답변 시스템`)
                .addComponents([
                    new TextInputComponent()
                        .setCustomId('reply-input-1')
                        .setStyle('SHORT')//장문
                        .setLabel(`답변하실 유저 ID`)
                        .setPlaceholder(`USER ID 를 넣어주세요.`)
                        .setMinLength(16)
                        .setMaxLength(20)
                        .setRequired(true),
                    new TextInputComponent()
                        .setCustomId('reply-input-2')
                        .setStyle('LONG')//장문
                        .setLabel(`답변하실 내용을 입력해주세요.`)
                        .setPlaceholder(`문의에 대한 답변만 넣어주세요.\n친절히 해주시는 관리자님에게 감사합니다 :)`)
                        .setMinLength(1)
                        .setMaxLength(4000)
                        .setRequired(true),
                ]);
            await showModal(modal, {
                client: client,
                interaction: interaction
            })
        } else return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("권한이 없습니다.")
                    .setColor(`RED`)
                    .setDescription("해당 명령어는 관리자만 사용할수 있습니다.")
            ]
        })
    }
}