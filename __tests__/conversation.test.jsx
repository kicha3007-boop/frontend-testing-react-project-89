import { beforeEach, describe, expect, test } from "vitest";
import courseSteps from "../__fixtures__/courseSteps.json";
import supportSteps from "../__fixtures__/supportSteps.json";
import { findStep, getButtonTexts, renderWidget } from "./helpers/setup";

const welcome = findStep(courseSteps, "welcome");
const start = findStep(courseSteps, "start");
const beginner = findStep(courseSteps, "beginner");
const advanced = findStep(courseSteps, "advanced");
const finish = findStep(courseSteps, "finish");

describe("переходы между шагами сценария", () => {
  let chat;

  beforeEach(async () => {
    ({ chat } = renderWidget(courseSteps));
    await chat.open();
  });

  test("ответ появляется в переписке, за ним — сообщение следующего шага", async () => {
    await chat.answer("Начать разговор");

    expect(chat.getMessages()).toEqual([...welcome.messages, "Начать разговор", ...start.messages]);
  });

  test("после ответа показываются кнопки следующего шага вместо прежних", async () => {
    await chat.answer("Начать разговор");

    expect(chat.getAnswers()).toEqual(getButtonTexts(start));
  });

  test("кнопка ведёт на шаг из своего nextStepId", async () => {
    await chat.answer("Начать разговор");
    await chat.answer("Я уже программирую");

    expect(chat.getMessages().slice(-advanced.messages.length)).toEqual(advanced.messages);
    expect(chat.getAnswers()).toEqual(getButtonTexts(advanced));
  });

  test("все сообщения шага показываются по порядку", async () => {
    await chat.answer("Начать разговор");
    await chat.answer("Я уже программирую");

    expect(chat.getMessages()).toEqual([
      ...welcome.messages,
      "Начать разговор",
      ...start.messages,
      "Я уже программирую",
      ...advanced.messages,
    ]);
  });

  test("при возврате на прошлый шаг история сохраняется, а кнопки шага возвращаются", async () => {
    await chat.answer("Начать разговор");
    await chat.answer("Хочу попробовать себя в IT");
    await chat.answer("Вернуться назад");

    expect(chat.getMessages()).toEqual([
      ...welcome.messages,
      "Начать разговор",
      ...start.messages,
      "Хочу попробовать себя в IT",
      ...beginner.messages,
      "Вернуться назад",
      ...start.messages,
    ]);
    expect(chat.getAnswers()).toEqual(getButtonTexts(start));
  });

  test("на последнем шаге без кнопок вариантов ответа нет", async () => {
    await chat.answer("Начать разговор");
    await chat.answer("Хочу попробовать себя в IT");
    await chat.answer("Записаться");

    expect(chat.getMessages().at(-1)).toEqual(finish.messages[0]);
    expect(chat.getAnswers()).toEqual([]);
  });
});

describe("другой сценарий", () => {
  test("бот идёт по переходам конфигурации и возвращается в начало", async () => {
    const { chat } = renderWidget(supportSteps);
    await chat.open();

    await chat.answer("Оплата");
    await chat.answer("В начало");

    const supportWelcome = findStep(supportSteps, "welcome");
    const payment = findStep(supportSteps, "payment");
    expect(chat.getMessages()).toEqual([
      ...supportWelcome.messages,
      "Оплата",
      ...payment.messages,
      "В начало",
      ...supportWelcome.messages,
    ]);
    expect(chat.getAnswers()).toEqual(getButtonTexts(supportWelcome));
  });
});
