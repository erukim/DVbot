const { Client, Intents, Collection, MessageEmbed } = require('discord.js')
const client = new Client({ intents: 32767 })
const { token, mongo_url, prefix } = require('./src/data/config.json')
const { errlog } = require('./src/data/logs.json')
client.login(token)
module.exports = client;
const fs = require('fs')
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const commands = []
client.slashcommands = new Collection()
// const mongoose = require("mongoose")
// mongoose.connect(mongo_url, {
//     useNewUrlParser: true, useUnifiedTopology: true
// }).then(console.log("✅ | 데이터베이스 연결 완료"))
require('discord-modals')(client)

//슬래쉬 커맨드
fs.readdirSync("./src/command/slash").forEach(dirs => {
    const commandfolder = fs.readdirSync(`./src/command/slash/${dirs}/`).filter(file => file.endsWith(".js"))
    for (const file of commandfolder) {
        const command = require(`./src/command/slash/${dirs}/${file}`)
        commands.push(command.data.toJSON());
        client.slashcommands.set(command.data.name, command)
    }
})
const rest = new REST({ version: '9' }).setToken(token)

client.on("interactionCreate", async interaction => {
    if (!interaction.guild) return
    if (!interaction.isCommand() || interaction.isContextMenu) {
        const command = client.slashcommands.get(interaction.commandName)
        if (!command) return
        try {
            await command.execute(interaction, client)
        } catch (err) {
            const date = new Date()
            const timeset = Math.round(date.getTime() / 1000)
            const errembedlog = new MessageEmbed()
                .setColor('DARK_BUT_NOT_BLACK')
                .setTitle("SlashCommands Error Log")
                .setAuthor({ name: `${client.user.username} - System`, iconURL: client.user.displayAvatarURL() })
                .setFields(
                    { name: "사용된 명령어", value: `${interaction.commandName}`, inline: true },
                    { name: "사용시간", value: `<t:${timeset}>`, inline: true },
                    { name: `접수된 에러 내용입니다.`, value: `\`\`\`${err}\`\`\`` },
                    { name: `사용자`, value: `${interaction.user}`, inline: true },
                    { name: `사용자 이름`, value: `${interaction.user.username}`, inline: true },
                    { name: `사용자 태그`, value: `${interaction.user.tag}`, inline: true },
                    { name: `사용자 ID`, value: `${interaction.user.id}`, inline: true },
                )
                .setTimestamp()
            if (interaction.guild) {
                const channel = client.channels.cache.get(interaction.channel.id)
                const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
                let user = client.users.cache.get(interaction.guild.ownerId)
                if (!user) user = "Unknown#0000"
                errembedlog.addFields(
                    { name: `사용된 서버 소유자`, value: `${user.tag || user}`, inline: true },
                    { name: "사용서버", value: `${interaction.guild.name}`, inline: true },
                    { name: "사용서버id", value: `${interaction.guild.id}`, inline: true },
                    { name: "사용채널", value: `${interaction.channel}`, inline: true },
                    { name: "사용채널id", value: `${interaction.channel.id}`, inline: true },
                    { name: "에러발생서버 초대코드", value: `https://discord.gg/${invite.code}` },
                )
            }
            //client.channels.cache.get(errlog).send({ embeds: [errembedlog] })
            console.error(err)
            await interaction.reply({ content: "오류가 발생했습니다", ephemeral: true })
        }
    }
})
client.on('ready', async () => {
    console.log(`✅ | 빗금 수집완료`);
})

client.once('ready', async () => {
    client.user.setStatus('idle');
    try {
        console.log(`❓ | 빗금 커맨드 푸쉬중 . . .`)
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        )
        console.log(`✅ | 빗금 커맨드 푸쉬 완료`)
    } catch (e) {
        console.error(e)
    }
})

//오류 무시
process.on('uncaughtException', (err) => {
    console.error(err);
});
process.on("unhandledRejection", err => {
    if (err == "DiscordAPIError: Missing Access") return console.log("봇에게 슬래쉬 커맨드를 서버에 푸쉬 할 권한이 없어서 서버에 슬래쉬 커맨드를 푸쉬하지 못했습니다.")
    console.error(err)
})
client.on('ready', async () => {
    console.log(`✅ | 에러 무시 작동`);
})


//일반 커맨드
client.commands = new Collection()
fs.readdirSync(`./src/command/message`).forEach(dirs2 => {
    const commandsFile = fs.readdirSync(`./src/command/message/${dirs2}/`).filter(file => file.endsWith('.js'))
    for (const file of commandsFile) {
        const command = require(`./src/command/message/${dirs2}/${file}`)
        client.commands.set(command.name, command)
    }
})

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift()
    const command = client.commands.get(commandName)
    if (!command) return
    try {
        command.execute(message, args, client)
    } catch (err) {
        console.error(err)
        const embed = new MessageEmbed()
            .setTitle('오류 발생')
            .setDescription(`에러가 발생하여 명령어가 정상작동 하지 못하였습니다.`)
            .setColor("RED")
        message.channel.send({ embeds: [embed] })
        const date = new Date()
        const timeset = Math.round(date.getTime() / 1000)
        const errembedlog = new MessageEmbed()
            .setColor('DARK_BUT_NOT_BLACK')
            .setTitle("Message Command Error Log")
            .setAuthor({ name: `${client.user.username} - System`, iconURL: client.author.displayAvatarURL() })
            .setFields(
                { name: "사용된 명령어", value: `${prefix.length}`, inline: true },
                { name: "사용시간", value: `<t:${timeset}>`, inline: true },
                { name: `접수된 에러 내용입니다.`, value: `\`\`\`${err}\`\`\`` },
                { name: `사용자`, value: `${message.author}`, inline: true },
                { name: `사용자 이름`, value: `${message.author.username}`, inline: true },
                { name: `사용자 태그`, value: `${message.author.tag}`, inline: true },
                { name: `사용자 ID`, value: `${message.author.id}`, inline: true },
            )
            .setTimestamp()
        if (message.guild) {
            const channel = client.channels.cache.get(message.channel.id)
            const invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
            let user = client.users.cache.get(message.guild.ownerId)
            if (!user) user = "Unknown#0000"
            errembedlog.addFields(
                { name: `사용된 서버 소유자`, value: `${user.tag || user}`, inline: true },
                { name: "사용서버", value: `${message.guild.name}`, inline: true },
                { name: "사용서버id", value: `${message.guild.id}`, inline: true },
                { name: "사용채널", value: `${message.channel}`, inline: true },
                { name: "사용채널id", value: `${message.channel.id}`, inline: true },
                { name: "에러발생서버 초대코드", value: `https://discord.gg/${invite.code}` },
            )
        }
        //client.channels.cache.get(errlog).send({ embeds: [errembedlog] })
    }
})
client.on('ready', async () => {
    console.log(`✅ | 커맨드 수집완료`);
})


//이벤트 핸들
fs.readdirSync(`./src/events`).forEach(dirs3 => {
    const eventFiles = fs.readdirSync(`./src/events/${dirs3}/`).filter(file => file.endsWith('.js'));

    eventFiles.forEach(file => {
        const event = require(`./src/events/${dirs3}/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.run(...args));
        } else {
            client.on(event.name, (...args) => event.run(...args));
        }
    })
})
client.on('ready', async () => {
    console.log(`✅ | 이벤트 핸들러`);
})


client.on('ready', async () => {
    console.log(`✅ | index.js 최종 가동완료`);
})