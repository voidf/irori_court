import LocalizedStrings from 'localized-strings';
// const LocalizedStrings = require('LocalizedStrings').default;

const strings = new LocalizedStrings({
    zh: {
    handle: "用户名",
    password: "密码",
    handleRequired:"用户名不能为空",
    passwordRequired:"密码不能为空",
    // fridge: {
    //   egg: "Egg",
    //   milk: "Milk",
    // }
  },
  en: {
    handle: "Handle",
    password: "Password",

    handleRequired:"Handle is required",
    passwordRequired:"Password is required",
    // fridge: {
    //   egg: "Uovo",
    //   milk: "Latte",
    // }
  }},
);

export default strings;