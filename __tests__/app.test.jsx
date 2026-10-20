import { describe, expect, test } from "vitest";
import courseSteps from "../__fixtures__/courseSteps.json";
import registration from "../__fixtures__/registration.json";
import { findStep, getButtonTexts, renderApp } from "./helpers/setup";

const welcome = findStep(courseSteps, "welcome");
const start = findStep(courseSteps, "start");

// Строки таблицы результата: поля отсортированы по ключу формы
const expectedRows = [
  ["Принять правила", "true"],
  ["Адрес", registration.address],
  ["Город", registration.city],
  ["Страна", registration.country],
  ["Email", registration.email],
  ["Пароль", registration.password],
];

describe("приложение со встроенным виджетом", () => {
  test("показывает и форму регистрации, и кнопку открытия чата", () => {
    const { chat, form } = renderApp(courseSteps);

    expect(form.form).toBeVisible();
    expect(chat.openButton).toBeVisible();
    expect(chat.queryDialog()).not.toBeInTheDocument();
  });

  test("форма отправляется и показывает введённые данные", async () => {
    const { form } = renderApp(courseSteps);

    await form.fill(registration);
    await form.submit();

    expect(form.queryForm()).not.toBeInTheDocument();
    expect(form.getResultRows()).toEqual(expectedRows);
  });

  test("кнопка «Назад» возвращает форму с заполненными полями", async () => {
    const { form } = renderApp(courseSteps);
    await form.fill(registration);
    await form.submit();

    await form.backToForm();

    expect(form.form).toBeVisible();
    expect(form.getFieldValues()).toEqual(registration);
  });

  test("виджет в приложении ведёт разговор по сценарию", async () => {
    const { chat } = renderApp(courseSteps);
    await chat.open();

    await chat.answer("Начать разговор");

    expect(chat.getMessages()).toEqual([...welcome.messages, "Начать разговор", ...start.messages]);
    expect(chat.getAnswers()).toEqual(getButtonTexts(start));
  });

  test("разговор с ботом не сбрасывает введённые в форму данные", async () => {
    const { chat, form } = renderApp(courseSteps);
    await form.fill(registration);

    await chat.open();
    await chat.answer("Начать разговор");
    await chat.close();

    expect(form.getFieldValues()).toEqual(registration);
    await form.submit();
    expect(form.getResultRows()).toEqual(expectedRows);
  });

  test("виджет работает и после отправки формы", async () => {
    const { chat, form } = renderApp(courseSteps);
    await form.fill(registration);
    await form.submit();

    await chat.open();

    expect(chat.getMessages()).toEqual(welcome.messages);
    expect(form.getResultRows()).toEqual(expectedRows);
  });
});
