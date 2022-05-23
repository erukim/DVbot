const { MessageEmbed, CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("서버정보")
        .setDescription('서버정보를 알려줘요'),
    /**
     * @param { CommandInteraction } Interaction
     */
    async execute(interaction, client) {
        if (!interaction.guild) return interaction.reply("서버에서만 사용할수 있습니다.")
        let user = client.users.cache.get(interaction.guild.ownerId)
        if (!user) user = "Unknown#0000"
        const han = new MessageEmbed()
            .setTitle(`${interaction.guild.name} 서버 정보`)
            .addField(":white_circle: | 서버 이름", `${interaction.guild.name}`)
            .addField(":key:| 서버 아이디", `${interaction.guild.id}`)
            .addFields(
                { name: `:beginner:| 서버 소유자`, value: `${user || user}`, inline: true },
                { name: ":beginner:| 서버 주인id", value: `<@${interaction.guild.ownerId}>`, inline: true },
                { name: `:beginner:| 서버 소유자Tag`, value: `${user.tag || user}`, inline: true },
            )
            .addField(":balloon: | 서버 생성일", `${interaction.guild.createdAt}`)
            .addField(":woman: | 서버 멤버", `${interaction.guild.memberCount}명`)
            .addField(":red_circle: | 서버 부스트 레벨", `${interaction.guild.premiumTier || "0"} 레벨`)
            .addField(":red_circle: | 부스트 개수:", `${interaction.guild.premiumSubscriptionCount}개`)
            .addField(":speech_balloon: | 텍스트 채널개수", `${interaction.guild.channels.cache.filter(x => x.type === "GUILD_TEXT").size}개`)
            .addField(":loud_sound: | 음성 채널개수", `${interaction.guild.channels.cache.filter(x => x.type === "GUILD_VOICE").size}개`)
            .addFields(
                { name: "카테고리", value: `${interaction.guild.channels.cache.filter(x => x.type === "GUILD_CATEGORY").size} 개`, inline: true },
                { name: "이모지", value: `${interaction.guild.emojis.cache.filter((e) => !e.animated).size} / 50 `, inline: true },
                { name: "움직이는 이모지", value: `${interaction.guild.emojis.cache.filter((e) => e.animated).size} / 50 `, inline: true },
            )

            .setThumbnail(interaction.guild.iconURL())

            .setTimestamp()
        interaction.reply({ embeds: [han] })
    }

}