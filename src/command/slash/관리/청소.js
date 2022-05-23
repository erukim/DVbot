const { CommandInteraction, MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { boturl, name, botimg, crl, footer } = require("../../../data/embed.json");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("청소")
        .setDescription(`메시지 청소를 합니다.`)
        .addStringOption(option => option
            .setName("청소-갯수")
            .setDescription("청소하실 채팅 갯수를 1에서 100의 수를 입력해주세요.")
            .setRequired(true))
        .addUserOption(option => option
            .setName("유저")
            .setDescription("특정 유저를 선택하면 그유저의 채팅만 삭제합니다.")
            .setRequired(false)),
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        if(!interaction.guild) return interaction.reply("서버에서만 사용할수 있습니다.")
        const { channel, option } = interaction;

        const Amount = interaction.options.getString("청소-갯수");
        const Target = interaction.options.getMember("유저");
        const embed0 = {
            color: `${crl}`,
            title: `${interaction.guild}`,
            author: {
                name: `${name}`,
                icon_url: `${botimg}`,
                url: `${boturl}`,
            },
            description: `${name}에서 제작된 서버 관리 봇입니다.`,
            thumbnail: {
                url: `${interaction.guild.iconURL()}`,
            },
            fields: [
                {
                    name: `<a:x_:941623055703236639> 경고 <a:x_:941623055703236639>`,
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
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return interaction.reply({embeds: [embed0]})
        const embed1 = {
            color: `${crl}`,
            title: `${interaction.guild}`,
            author: {
                name: `${name}`,
                icon_url: `${botimg}`,
                url: `${boturl}`,
            },
            description: `${name}에서 제작된 서버 관리 봇입니다.`,
            thumbnail: {
                url: `${interaction.guild.iconURL()}`,
            },
            fields: [
                {
                    name: `<a:x_:941623055703236639> 경고 <a:x_:941623055703236639>`,
                    value: `1에서 100의 숫자를 입력해주세요.`,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: footer,
                icon_url: `${botimg}`,
            },
        };
        if (isNaN(Amount)) return interaction.reply({embeds: [embed1], ephemeral: true })
        const MessageCount = parseInt(Amount)
        if(MessageCount < 0 || MessageCount > 100) return interaction.reply({embeds: [embed1], ephemeral: true })

        const Messages = await channel.messages.fetch();

        const Response = new MessageEmbed()
        .setColor("LUMINOUS_VIVID_PINK");

        if(Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                const embed2 = {
                    color: `${crl}`,
                    title: `${interaction.guild}`,
                    author: {
                        name: `${name}`,
                        icon_url: `${botimg}`,
                        url: `${boturl}`,
                    },
                    description: `${name}에서 제작된 서버 관리 봇입니다.`,
                    thumbnail: {
                        url: `${interaction.guild.iconURL()}`,
                    },
                    fields: [
                        {
                            name: `<a:o_:941623085788975206> 특정 유저 채팅 청소 완료 <a:o_:941623085788975206>`,
                            value: `정상적으로 특정 유저의 채팅의 청소가 완료되었습니다.

자세한 내용은 아래를 참고해주세요.\n`,
                        },
                        {
                            name: `🧹입력한 메시지`,
                            value: `${Amount}`,
                            inline: true,
                        },
                        {
                            name: `🧹청소된 메시지 갯수`,
                            value: `${messages.size}`,
                            inline: true,
                        },
                        {
                            name: `청소한 특정유저`,
                            value: `${Target}`,
                            inline: true,
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: footer,
                        icon_url: `${botimg}`,
                    },
                };
                //Response.setDescription(`🧹 Cleard ${messages.size} from ${Target}.`);
                interaction.reply({embeds: [embed2]});
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                const embed2 = {
                    color: `${crl}`,
                    title: `${interaction.guild}`,
                    author: {
                        name: `${name}`,
                        icon_url: `${botimg}`,
                        url: `${boturl}`,
                    },
                    description: `${name}에서 제작된 서버 관리 봇입니다.`,
                    thumbnail: {
                        url: `${interaction.guild.iconURL()}`,
                    },
                    fields: [
                        {
                            name: `<a:o_:941623085788975206> 청소 완료 <a:o_:941623085788975206>`,
                            value: `정상적으로 청소가 완료되었습니다.

    자세한 내용은 아래를 참고해주세요.\n`,
                        },
                        {
                            name: `🧹입력한 메시지`,
                            value: `${Amount}`,
                            inline: true,
                        },
                        {
                            name: `🧹청소된 메시지 갯수`,
                            value: `${messages.size}`,
                            inline: true,
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: footer,
                        icon_url: `${botimg}`,
                    },
                };
                //Response.setDescription(`🧹 Cleard ${messages.size} from this channel.`);
                interaction.reply({embeds: [embed2]})
            })
        }
    }
}