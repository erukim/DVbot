const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("주사위")
        .setDescription("숫자를 입력해 랜덤숫자를 알려줍니다!")
        .addStringOption(options => options
            .setName("최대숫자")
            .setDescription("숫자를 입력해 주세요.")
            .setRequired(true)),
    async execute(interaction) {
        const args = interaction.options.getString("최대숫자")
            if(!args) return interaction.reply({ content: "최대숫자를 입력해주세요", ephemeral: true })
            if(isNaN(args)) return interaction.reply({ content: "올바른 숫자를 입력해주세요", ephemeral: true })
            const randomnumber = Math.floor(Math.random() * args)
            interaction.reply({content : `${randomnumber}`})
    }
}