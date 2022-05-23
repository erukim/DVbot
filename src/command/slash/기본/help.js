const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');
const { boturl, name, botimg, discordurl, botname, crl } = require("../../../data/embed.json");
const footermsg = `DV BOT`
const client = require('../../../../index')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription(`${botname}의 명령어를 확인합니다.`),
    async execute(interaction) {
        if (!interaction.guild) return
        await interaction.deferReply({});
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("select")
                .setPlaceholder("궁금하신 기능을 선택해주세요.")
                .addOptions([
                    {
                        label: "일반 명령어",
                        value: "1",
                    },
                    {
                        label: "관리자 전용 명령어",
                        value: "2",
                    },
                ])
        );
        const embed = {
            color: `${crl}`,
            title: `${botname} 봇 명령어`,
            url: `${discordurl}`,
            author: {
                name: `${name}`,
                icon_url: `${botimg}`,
                url: `${boturl}`,
            },
            description: `${name}에서 제작된 서버 관리 봇입니다.`,
            thumbnail: {
                url: `${botimg}`,
            },
            fields: [
                {
                    name: `\u200b`,
                    value: `🔨 DV BOT 도움말 안내

\`Bot Ping\`: ${client.ws.ping}ms

Developer: & ㅁㅅ#0007
[ DV BOT 서포트서버 ](https://discord.gg/nxmxPrPwjm)
\u200b\n`,
                },
            ],
            timestamp: new Date(),
            footer: {
                text: footermsg,
                icon_url: `${botimg}`,
            },
        };

        await interaction.followUp({ embeds: [embed], components: [row] })

        const filter = (interaction) => {
            return interaction.customId === "select";
        };

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 100 * 1000,
        });

        collector.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id)
                return i.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("<a:x_:941623055703236639> 권한이 없습니다.")
                            .setColor(`RED`)
                            .setDescription(`${interaction.user}님은 봇 명령어를 호출한 유저가 아니여서
정상적으로 조작이 불가능합니다.

조작을 원하시면 \`/help\`라는 명령어를 이용해 호출해주세요!`)
                    ],
                    ephemeral: true,
                });
            if (i.customId === "select") {
                const selectedValue = i.values[0];
                if (selectedValue === "1") { //기본명령어
                    const embed = {
                        color: `${crl}`,
                        title: `[ - DV BOT 일반 명령어 - ]`,
                        url: `${discordurl}`,
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
                                name: '/유저정보 [유저]',
                                value: `해당 유저의 정보를 확인합니다.`,
                                inline: true,
                            },
                            {
                                name: '/서버정보',
                                value: `명령어가 실행된 서버정보를 확인합니다.`,
                                inline: true,
                            },
                            {
                                name: '/주사위 [숫자]',
                                value: `주사위를 돌려 랜덤값을 확인합니다.`,
                                inline: true,
                            },
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: footermsg,
                            icon_url: `${botimg}`,
                        },
                    };
                    i.update({ embeds: [embed], components: [row] });
                }
                if (selectedValue === "2") { //관리자 명령어
                    const embed = {
                        color: `${crl}`,
                        title: `[ - 관리자 전용 명령어 - ]`,
                        url: `${discordurl}`,
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
                                name: '/청소 [갯수]',
                                value: `입력된 개수만큼 메시지를 삭제합니다.`,
                                inline: true,
                            },
                            {
                                name: '/관리 [유저]',
                                value: `태그된 유저를 서버에서 차단/추방 합니다.`,
                                inline: true,
                            },
                            {
                                name: '/공지',
                                value: `공지사항 채널에 공지메시지를 전송합니다.`,
                                inline: true,
                            },
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: footermsg,
                            icon_url: `${botimg}`,
                        },
                    };
                    i.update({ embeds: [embed], components: [row] });
                }
            }
        });

        collector.on("end", async (collect) => {
            console.log("시간초과!");
            interaction.editReply({ components: [] }); //연동작업
        });
    },
};
