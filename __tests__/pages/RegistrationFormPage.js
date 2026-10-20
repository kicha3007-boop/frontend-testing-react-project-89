import { screen, within } from "@testing-library/react";

// Page Object хост-приложения: форма регистрации и таблица с результатом
export default class RegistrationFormPage {
  constructor(user) {
    this.user = user;
  }

  get form() {
    return screen.getByRole("form");
  }

  queryForm() {
    return screen.queryByRole("form");
  }

  async fill({ email, password, address, city, country, acceptRules }) {
    await this.user.type(screen.getByLabelText("Email"), email);
    await this.user.type(screen.getByLabelText("Пароль"), password);
    await this.user.type(screen.getByLabelText("Адрес"), address);
    await this.user.type(screen.getByLabelText("Город"), city);
    await this.user.selectOptions(screen.getByLabelText("Страна"), country);
    if (acceptRules) {
      await this.user.click(screen.getByRole("checkbox", { name: "Принять правила" }));
    }
  }

  async submit() {
    await this.user.click(screen.getByRole("button", { name: "Зарегистрироваться" }));
  }

  async backToForm() {
    await this.user.click(screen.getByRole("button", { name: "Назад" }));
  }

  // Значения полей формы так, как их видит пользователь
  getFieldValues() {
    return {
      email: screen.getByLabelText("Email").value,
      password: screen.getByLabelText("Пароль").value,
      address: screen.getByLabelText("Адрес").value,
      city: screen.getByLabelText("Город").value,
      country: screen.getByLabelText("Страна").value,
      acceptRules: screen.getByRole("checkbox", { name: "Принять правила" }).checked,
    };
  }

  // Таблица результата: подпись поля → показанное значение
  getResultRows() {
    const rows = within(screen.getByRole("table")).getAllByRole("row");
    return rows.map((row) =>
      within(row)
        .getAllByRole("cell")
        .map((cell) => cell.textContent),
    );
  }
}
