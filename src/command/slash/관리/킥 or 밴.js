const { Permissions , MessageActionRow , MessageSelectMenu , MessageEmbed} = require('discord.js')
const { SlashCommandBuilder } = require("@discordjs/builders")
const { boturl, name, botimg, crl, footer } = require("../../../data/embed.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("관리")
        .setDescription("선택한 유저를 추방하거나 차단합니다.")
        .addUserOption(option => option.setName("유저").setDescription("유저를 멘션해 주세요").setRequired(true)),
    //name:"추방",
    async execute(interaction){
        if(!interaction.guild) return interaction.reply("서버에서만 사용할수 있습니다.")
        const member = interaction.options.getMember("유저")
        const embed0 = {
            color: `${crl}`,
            title: `${interaction.guild}`,
            author: {
                name: `${name}`,
                icon_url: `${botimg}`,
                url: `${boturl}`,
            },
            thumbnail: {
                url: `${interaction.guild.iconURL()}`,
            },
            fields: [
                {
                    name: `⛔ 경고 ⛔`,
                    value: `해당 기능은 관리자 명령어 입니다.
        \u200b\n`,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: footer,
                icon_url: `${botimg}`,
            },
        };
        if(!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return interaction.reply({embeds: [embed0]})
        
        const menu = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId("select")
            .setPlaceholder("옵션을 선택해주세요")
            .addOptions([{
                label:"킥",description:"추방",value:"킥"
            },{
                label:"밴",description:"영구추방",value:"밴"
            }])
        )
        let embed = new MessageEmbed()
        .setTitle("밴/킥")
        .setDescription("아래매뉴로 옵션을 선택해주세요")
        .setColor("GREEN")
        .setTimestamp()
        
        await interaction.reply({ content: "추방을 할때는 신중히 결정해주세요.", ephemeral: true })
        const sendmsg = await interaction.channel.send({ embeds : [embed] , components : [menu]})
        const embed1 = new MessageEmbed()
        .setTitle("유저를 추방함")
        .setDescription(`추방당한 유저 : ${member}\n처리자 : ${interaction.user}`)
        .setTimestamp()
        .setColor("RED")

        const embed2 = new MessageEmbed()
        .setTitle("유저가 밴당함")
        .setDescription(`밴당한 유저 : ${member}\n 처리자 ${interaction.user}`)
        .setTimestamp()
        .setColor("RED")

        const collector = interaction.channel.createMessageComponentCollector({
            componentType:"SELECT_MENU",
            time:60000
        })
        collector.on('collect', collected =>{
            const value = collected.values[0]
            if(collected.member.id !== interaction.user.id) return 
            if(value == "킥"){
                member.kick().then().catch((error)=>{
                    interaction.channel.send(`오류가 발생했습니다 ${error}`)
                })
                sendmsg.edit({embeds : [embed1], components: [] })
            }
            if(value == "밴"){
                member.ban().then().catch((error)=>{
                    interaction.reply(`오류가 발생했습니다 ${error}`)
                })
                sendmsg.edit({embeds : [embed2], components: [] })
            }
        })





}
}