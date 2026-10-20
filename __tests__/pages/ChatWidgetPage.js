import { screen, waitFor, within } from "@testing-library/react";

const openButtonName = "Открыть Чат";
const closeButtonName = "Close";
const chatTitle = "Виртуальный помощник";

// Page Object виджета: тесты работают с ним через то, что видит пользователь, —
// кнопки, заголовок окна, тексты сообщений
export default class ChatWidgetPage {
  constructor(user) {
    this.user = user;
  }

  get openButton() {
    return screen.getByRole("button", { name: openButtonName });
  }

  get dialog() {
    return screen.getByRole("dialog", { name: chatTitle });
  }

  queryDialog() {
    return screen.queryByRole("dialog", { name: chatTitle });
  }

  async open() {
    await this.user.click(this.openButton);
    return screen.findByRole("dialog", { name: chatTitle });
  }

  async close() {
    const closeButton = within(this.dialog).getByRole("button", { name: closeButtonName });
    await this.user.click(closeButton);
    // Окно исчезает после анимации, поэтому ждём, пока его не станет в документе
    await waitFor(() => {
      if (this.queryDialog()) {
        throw new Error("Окно чата всё ещё открыто");
      }
    });
  }

  async answer(text) {
    const button = within(this.dialog).getByRole("button", { name: text });
    await this.user.click(button);
  }

  // Переписка целиком: реплики бота и ответы пользователя в порядке появления
  getMessages() {
    return within(this.dialog)
      .queryAllByRole("paragraph")
      .map((message) => message.textContent);
  }

  // Варианты ответа текущего шага (всё, кроме крестика закрытия окна)
  getAnswers() {
    return within(this.dialog)
      .queryAllByRole("button", { name: (name) => name !== closeButtonName })
      .map((button) => button.textContent);
  }
}
