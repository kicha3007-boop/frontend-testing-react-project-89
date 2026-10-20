import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, expect, vi } from "vitest";

// Матчеры регистрируются на том expect, которым пользуются тесты.
// Готовый модуль "@testing-library/jest-dom/vitest" сам импортирует vitest
// из node_modules и при запуске чужим экземпляром vitest расширяет не тот expect.
expect.extend(matchers);

// jsdom не умеет прокручивать страницу, а виджет прокручивает переписку
// к последнему сообщению. Заглушка ставится заново перед каждым тестом,
// чтобы счётчик вызовов не переходил из теста в тест.
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
});
