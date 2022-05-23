const client = require('../../../index')
const { MessageEmbed, CommandInteraction } = require('discord.js')
const adminid = '939349343431954462'

client.on('modalSubmit', async (modal, message, interaction) => {
    /**
     * @param {CommandInteraction} interaction
     */
    if (modal.customId === "help-1") {
        await modal.deferReply({ ephemeral: true });
        let result = modal.getTextInputValue('help-input-1')

        modal.followUp({
            embeds: [
                new MessageEmbed()
                    .setTitle(`❣ 문의가 정상적으로 접수되었습니다 ❣`)
                    .setColor('BLURPLE')
                    .setAuthor({ name: `DV - 문의시스템`, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`접수하신 문의는 DM으로 확인가능 하며\n추가적으로 문의를 하실경우 /문의 (내용)으로 가능합니다.`)
                    .setTimestamp()
                    .setFooter(`${modal.user.tag}`)]
        });
        client.users.fetch(modal.user.id).then((user) => {
            const embed6 = new MessageEmbed()
                .setTitle(`❣ 접수하신 문의 내용입니다. ❣`)
                .setColor('BLURPLE')
                .setAuthor({ name: `DV - 문의시스템`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`**내용**\n**\`\`\`` + result + `\`\`\`**`)
                .setTimestamp()
                .setFooter(`문의해주셔서 감사합니다.`)
            user.send({ embeds: [embed6] })
        });
        client.users.fetch(adminid).then((user) => {
            const embed6 = new MessageEmbed()
                .setTitle(`❣ 유저로 부터 문의가 도착했습니다 ❣`)
                .setColor('BLURPLE')
                .setAuthor({ name: `DV - 문의시스템`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`**내용**\n**\`\`\`` + result + `\`\`\`**`)
                .addField(`문의유저`, `${modal.user.tag}`)
                .setTimestamp()
                .setFooter(`답변 방법 : /답변 ${modal.user.id} (답변 내용)`)
            user.send({ embeds: [embed6] })
            client.channels.cache.get('978192492224716870').send({ embeds: [embed6] })//서폿서버
        });
    }
});