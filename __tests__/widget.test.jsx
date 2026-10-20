import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import courseSteps from "../__fixtures__/courseSteps.json";
import supportSteps from "../__fixtures__/supportSteps.json";
import { findStep, getButtonTexts, renderWidget } from "./helpers/setup";

const courseWelcome = findStep(courseSteps, "welcome");
const supportWelcome = findStep(supportSteps, "welcome");

describe("отрисовка виджета", () => {
  test("показывает кнопку открытия чата, а окно чата закрыто", () => {
    const { chat } = renderWidget(courseSteps);

    expect(chat.openButton).toBeVisible();
    expect(chat.queryDialog()).not.toBeInTheDocument();
    expect(screen.queryByText(courseWelcome.messages[0])).not.toBeInTheDocument();
  });
});

describe("открытие и закрытие окна", () => {
  test("кнопка открывает окно с заголовком и приветственным шагом", async () => {
    const { chat } = renderWidget(courseSteps);

    const dialog = await chat.open();

    expect(dialog).toBeVisible();
    expect(chat.getMessages()).toEqual(courseWelcome.messages);
    expect(chat.getAnswers()).toEqual(getButtonTexts(courseWelcome));
  });

  test("начинает разговор с шага welcome, даже если он не первый в конфигурации", async () => {
    const { chat } = renderWidget(supportSteps);

    await chat.open();

    expect(chat.getMessages()).toEqual(supportWelcome.messages);
    expect(chat.getAnswers()).toEqual(["Оплата", "Доступ к курсу", "Позвать человека"]);
  });

  test("крестик закрывает окно, а кнопка открытия остаётся на странице", async () => {
    const { chat } = renderWidget(courseSteps);
    await chat.open();

    await chat.close();

    expect(chat.queryDialog()).not.toBeInTheDocument();
    expect(screen.queryByText(courseWelcome.messages[0])).not.toBeInTheDocument();
    expect(chat.openButton).toBeVisible();
  });

  test("после закрытия окно можно открыть снова, и разговор начинается сначала", async () => {
    const { chat } = renderWidget(courseSteps);
    await chat.open();
    await chat.answer("Начать разговор");
    await chat.close();

    await chat.open();

    expect(chat.getMessages()).toEqual(courseWelcome.messages);
    expect(chat.getAnswers()).toEqual(getButtonTexts(courseWelcome));
  });
});

describe("прокрутка переписки", () => {
  test("при открытии окна переписка прокручивается к концу", async () => {
    const { chat } = renderWidget(courseSteps);

    await chat.open();

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });

  test("после ответа переписка прокручивается к новому сообщению", async () => {
    const { chat } = renderWidget(courseSteps);
    await chat.open();
    const { scrollIntoView } = window.HTMLElement.prototype;
    const scrollsBeforeAnswer = scrollIntoView.mock.calls.length;

    await chat.answer("Начать разговор");

    expect(scrollIntoView.mock.calls.length).toBeGreaterThan(scrollsBeforeAnswer);
  });
});
