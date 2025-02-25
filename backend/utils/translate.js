const translations = {
  en: {
    welcome: "Welcome to our Library!",
    login_success: "Login successful!",
    access_denied: "Access Denied",
    error_occurred: "An error occurred. Please try again.",
  },
  ru: {
    welcome: "Добро пожаловать в нашу библиотеку!",
    login_success: "Вход выполнен успешно!",
    access_denied: "Доступ запрещен",
    error_occurred: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
  },
};

export const translate = (key, lang = "en") => {
  return translations[lang]?.[key] || key;
};

export default translate;
