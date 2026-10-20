import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// jsdom не умеет прокручивать страницу, а виджет прокручивает переписку
// к последнему сообщению. Заглушка ставится заново перед каждым тестом,
// чтобы счётчик вызовов не переходил из теста в тест.
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
});
