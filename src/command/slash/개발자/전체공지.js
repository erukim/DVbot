const { SlashCommandBuilder } = require("@discordjs/builders");
const admin = "939349343431954462" //이루#6410
const client = require('../../../../index')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("전체공지")
        .setDescription("봇이 들어가있는 모든서버에 공지를 해요")
        .addStringOption(options => options
            .setName("내용")
            .setDescription("공지내용을 입력해주세요.")
            .setRequired(true))
            ,
    async execute(interaction) {
        if (interaction.user.id !== admin) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("권한이 없습니다.")
                    .setColor(`RED`)
                    .setDescription("충분한 권한이 필요합니다.")
            ],
            ephemeral: true
        })
        const msg = interaction.options.getString("내용")
        const sayembed = new MessageEmbed()
            .setAuthor({ name: `DV BOT System`, iconURL: client.user.displayAvatarURL() })
            .setFooter(`공지 전송 ${interaction.user.username}`, client.user.displayAvatarURL())
            .setColor(0x2894C2)
            .setTimestamp()
        await interaction.deferReply({ ephemeral: true });

        var index = 0;

        interaction.followUp({ content: "성공적으로 공지를 전송했습니다!" })
        interaction.client.guilds.cache.forEach(guild => {
            sayembed.setTitle("공지사항")
            sayembed.setDescription(msg)
            if (guild.systemChannel) {
                guild.systemChannel.send({ embeds: [sayembed] })
                index = index + 1
            }

            if (!guild.systemChannel) {
                console.log(guild.name || guild.id)
            }
        })
        interaction.editReply(`${index}개의 서버에 공지를 보냈어요.`)
    }
}