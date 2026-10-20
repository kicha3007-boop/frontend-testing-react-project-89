import Widget from "@hexlet/chatbot-v2";
import { describe, expect, test } from "vitest";
import stepsWithBrokenLink from "../__fixtures__/stepsWithBrokenLink.json";
import stepsWithoutWelcome from "../__fixtures__/stepsWithoutWelcome.json";
import { findStep, getButtonTexts, renderWidget } from "./helpers/setup";

describe("некорректная конфигурация", () => {
  test("без шага welcome окно открывается пустым: ни сообщений, ни вариантов ответа", async () => {
    const { chat } = renderWidget(stepsWithoutWelcome);

    const dialog = await chat.open();

    expect(dialog).toBeVisible();
    expect(chat.getMessages()).toEqual([]);
    expect(chat.getAnswers()).toEqual([]);
  });

  test("с пустым списком шагов окно открывается пустым", async () => {
    const { chat } = renderWidget([]);

    const dialog = await chat.open();

    expect(dialog).toBeVisible();
    expect(chat.getMessages()).toEqual([]);
    expect(chat.getAnswers()).toEqual([]);
  });

  test("пустое окно закрывается как обычно", async () => {
    const { chat } = renderWidget([]);
    await chat.open();

    await chat.close();

    expect(chat.queryDialog()).not.toBeInTheDocument();
    expect(chat.openButton).toBeVisible();
  });

  test("без конфигурации виджет не создаётся", () => {
    expect(() => Widget()).toThrow(TypeError);
  });
});

describe("кнопка ведёт на несуществующий шаг", () => {
  const welcome = findStep(stepsWithBrokenLink, "welcome");

  test("ответ попадает в переписку, а кнопки текущего шага остаются", async () => {
    const { chat } = renderWidget(stepsWithBrokenLink);
    await chat.open();

    await chat.answer("Раздел, которого нет");

    expect(chat.getMessages()).toEqual([...welcome.messages, "Раздел, которого нет"]);
    expect(chat.getAnswers()).toEqual(getButtonTexts(welcome));
  });

  test("после неудачного перехода рабочая кнопка ведёт на свой шаг", async () => {
    const { chat } = renderWidget(stepsWithBrokenLink);
    await chat.open();

    await chat.answer("Раздел, которого нет");
    await chat.answer("Контакты");

    const contacts = findStep(stepsWithBrokenLink, "contacts");
    expect(chat.getMessages()).toEqual([
      ...welcome.messages,
      "Раздел, которого нет",
      "Контакты",
      ...contacts.messages,
    ]);
    expect(chat.getAnswers()).toEqual(getButtonTexts(contacts));
  });
});
