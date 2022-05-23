const { MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("공지")
    .setDescription("공지를 전송합니다.")
    .addStringOption( option => option
        .setName("제목")
        .setDescription("공지에 작성될 제목을 작성해주세요.")
        .setRequired(true))
    .addStringOption( option => option
        .setName("내용")
        .setDescription("공지에 작성될 내용을 작성해주세요.")
        .setRequired(true))
    .addChannelOption( option => option
        .setName("채널")
        .setDescription("공지를 보낼 채널을 작성해주세요.")
        .setRequired(true))
    .addStringOption( option => option
        .setName("멘션")
        .setDescription("사용하실 멘션을 선택해주세요.")
        .addChoices(
            {name:`사용안함`,value:` `},
            {name:`에브리원`,value:`@everyone`},
            {name:`히어`,value:`@here`},
        )
        .setRequired(true)),

    async execute(interaction, client) {
        if(!interaction.guild) return interaction.reply("서버에서만 사용할수 있습니다.")
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: "명령어를 사용할 권한이 없습니다.", ephemeral: true });
        var title1 = interaction.options.getString("제목")
        var some1 = interaction.options.getString("내용")
        var channel1 = interaction.options.getChannel("채널")
        const eveher = interaction.options.getString("멘션")

        interaction.reply({ content: `성공적으로 해당 채널에 공지를 보냈습니다.`, ephemeral: true })

        const embed = new MessageEmbed()
        .setTitle(`${title1}`)
        .setDescription(`${some1}`)
        .setColor("GREEN")
        .setTimestamp(new Date())
        .setFooter({ text: `관리자 : ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        client.channels.cache.get(`${channel1.id}`).send({content: `${eveher}`,embeds:[embed]}) 
    }
}