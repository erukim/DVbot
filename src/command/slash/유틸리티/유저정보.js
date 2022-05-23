const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('유저정보')
        .setDescription(`선택한 유저의 정보를 불러옵니다.`)
        .addUserOption(option => option.setName('유저').setDescription('확인하실 유저의 정보를 선택해주세요.').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({});
        const member = interaction.options.getMember('유저');
        const user = interaction.options.getUser('유저');
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        let rolemap = member.roles.cache.sort((a, b) => b.position - a.position).map(r => r).join(" ");
        if (rolemap.length > 1024) rolemap = "`The user has to many roles to display all of them!`";
        if (!rolemap) rolemap = "`사용자에게 역할이 없습니다!`";
        let status = {
            online: '온라인',
            idle: '자리비움',
            dnd: '다른 용무 중',
            offline: '오프라인'
        };
        let status2 = {
            true: '<a:1_:964698287909253130> ',
            false: '<a:Refusal:964456502960222222>'
        };
        const exampleEmbed = new MessageEmbed()
            .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
            .setThumbnail(user.displayAvatarURL())
            .setColor('#ea7777')
            .addFields(
                { name: '👱‍♂️' + ' 유저', value: `${user}`, inline: true },
                { name: '👼' + ' 태그', value: "`" + `${user.tag}` + "`", inline: true },
                { name: '📛' + ' 이름', value: "`" + `${user.username}` + "`", inline: true },
                { name: '🆔' + ' ID', value: "`" + `${user.id}` + "`", inline: true },
                { name: '✍️' + ' 서버 닉네임', value: "`" + `${member.nickname || user.username}` + "`", inline: true },
                { name: '<:ClydeBot:612740739495100419> ' + ' 봇 여부', value: `${status2[user.bot]}`, inline: true },
                { name: '<:voltic_join:932381522286227508> ' + ' 계정 생성일', value: `<t:` + `${Math.floor(user.createdTimestamp / 1000)}` + `:R>`, inline: true },
                { name: '<a:voltic_join:875440963697381437> ' + ' 서버 가입일', value: `<t:` + `${Math.floor(member.joinedTimestamp / 1000)}` + `:R>`, inline: true },
                //{ name: '<a:plexiOnline:478870259944783873>' + ' 상태', value: "`" + `${status[member.presence.status]}` + "`", inline: true },
                { name: '<:booster:660789028861509633>' + ' 서버 부스트', value: "`" + `${member.premiumSince?.toLocaleDateString("en-US", options) || "서버에 부스트를 하지 않았어요"}` + "`", inline: true },
                { name: '🔇' + ' 타임아웃', value: "`" + `${member.communicationDisabledUntil?.toLocaleDateString("en-US", options) || "타임아웃 되지 않음"}` + "`", inline: true },
                { name: '🎧' + ' 음성채널', value: `${member.voice.channel || "`음성채널에 미참가중`"}`, inline: true },
                { name: '<:role:923462604293300224>' + ' 보유 역할', value: rolemap, inline: true },
                { name: `역할 수`, value: `${member.roles.cache.size - 1}`, inline: true },
            )
            .setTimestamp();

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("list")
                .setLabel("역할 보유 권한")
                .setStyle("PRIMARY")
        );

        const filter = (interaction) => {
            return interaction.customId === "list";
        }

        interaction.followUp({ embeds: [exampleEmbed], components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 120 * 1000
        });

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "list") {
                exampleEmbed.addFields(
                    { name: '📜' + ' 보유 권한', value: "`" + `${member.permissions.toArray()}` + "`", inline: false },
                )
                interaction.update({ embeds: [exampleEmbed], components: [] });
            }
        })

        collector.on("end", async (collect) => {
            interaction.editReply({ components: [] });
        });
    },
};