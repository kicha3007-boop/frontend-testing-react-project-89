import Widget from "@hexlet/chatbot-v2";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from "../../src/App";
import ChatWidgetPage from "../pages/ChatWidgetPage";
import RegistrationFormPage from "../pages/RegistrationFormPage";

export const renderWidget = (steps) => {
  const user = userEvent.setup();
  render(Widget(steps));
  return { user, chat: new ChatWidgetPage(user) };
};

export const renderApp = (steps) => {
  const user = userEvent.setup();
  render(<App steps={steps} />);
  return {
    user,
    chat: new ChatWidgetPage(user),
    form: new RegistrationFormPage(user),
  };
};

// Тексты кнопок шага — ровно то, что пользователь должен увидеть вариантами ответа
export const getButtonTexts = (step) => step.buttons.map(({ text }) => text);

export const findStep = (steps, id) => steps.find((step) => step.id === id);
