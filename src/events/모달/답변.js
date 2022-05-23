const client = require('../../../index')
const { MessageEmbed, CommandInteraction } = require('discord.js')
const adminid = '939349343431954462'

client.on('modalSubmit', async (modal, message, interaction) => {
    /**
     * @param {CommandInteraction} interaction
     */
    if (modal.customId === "reply-1") {
        await modal.deferReply({ ephemeral: true });
        let result = modal.getTextInputValue('reply-input-1')
        let result2 = modal.getTextInputValue('reply-input-2')
        client.users.fetch(adminid).then((user) => {
            const date = new Date()
            const time = Math.round(date.getTime() / 1000)
            const embed6 = new MessageEmbed()
                .setTitle(`❣ 전달된 답변 내용입니다. ❣`)
                .setColor('BLURPLE')
                .setAuthor({ name: `DV - 문의시스템`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`**내용**\n**\`\`\`` + result2 + `\`\`\`**`)
                .setTimestamp()
                .setFooter(`답변이 정상적으로 전달되었습니다.`)
            modal.followUp({ embeds: [embed6] })
            const embed7 = {
                color: `BLURPLE`,
                title: `❣ 전달된 답변 내용입니다. ❣`,
                author: {
                    name: `DV - 문의시스템`,
                    icon_url: client.user.displayAvatarURL(),
                },
                thumbnail: {
                    url: `${modal.guild.iconURL()}`,
                },
                fields: [
                    {
                        name: `내용`,
                        value: `**\`\`\`` + result2 + `\`\`\`**`,
                    },
                    {
                        name: `답변 수신자`,
                        value: `<@${result}>`,
                        inline: true,
                    },
                    {
                        name: `답변 전송자`,
                        value: `${modal.user}`,
                        inline: true,
                    },
                    {
                        name: `답변이 전송된 실행된 시간`,
                        value: `<t:${time}>`,
                        inline: true,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `답변이 정상적으로 전달되었습니다.`,
                    icon_url: client.user.displayAvatarURL(),
                },
            };
            user.send({ embeds: [embed6] })
            client.channels.cache.get('978192843736764420').send({ embeds: [embed7] })
        });
        client.users.fetch(result).then((user) => {
            const embed6 = new MessageEmbed()
                .setTitle(`❣ 관리자로 부터 답변이 도착했습니다 ❣`)
                .setColor('BLURPLE')
                .setAuthor({ name: `DV - 문의시스템`, iconURL: client.user.displayAvatarURL() })
                .setDescription(`**내용**\n**\`\`\`` + result2 + `\`\`\`**`)
                .setTimestamp()
                .setFooter(`관리자 : ` + modal.user.username)
            user.send({ embeds: [embed6] })
        });
    }
});