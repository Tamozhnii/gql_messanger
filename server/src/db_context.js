// const { Sequelize, STRING, INTEGER, DATE, Op } = require('sequelize')
const { DataSource } = require('apollo-datasource')
const { validate } = require('isemail')

/**Класс для работы с БД */
class DB_API extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async findUser({ email } = {}) {
    if (!email || !validate(email)) return null
    const user = await this.store.Users.findOne({ where: { email } })
    return user ? user : null
  }

  /**Вход или создание пользователя TODO: Переделать функцию */
  async findOrCreateUser({ email: emailArg } = {}) {
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg
    if (!email || !validate(email)) return null

    const users = await this.store.Users.findOrCreate({ where: { email } })
    return users && users[0] ? users[0] : null
  }

  /**Получить всех пользователей TODO: Переделать на подписку*/
  async getAllUsers() {
    const allUsers = await this.store.Users.findAll()
    return allUsers ? allUsers : []
  }

  /**Получить все сообщения TODO: Переделать на подписку */
  async getMessages() {
    const allMessages = await this.store.Messages.findAll()
    return allMessages ? allMessages : []
  }

  /**Отправить сообщение */
  async sendMessage({ text }) {
    if (text && this.context.user) {
      this.store.Messages.create({
        model: 'message',
        properties: {
          text,
          date: Date.now(),
          userId: this.context.user.id,
        },
      })
    }
  }

  /**Редактировать сообщение */
  async editMessage() {}

  /**Удалить сообщение */
  async removeMessage() {}
}

module.exports = { DB_API }
