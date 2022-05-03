import LocalizedStrings from 'localized-strings';
// const LocalizedStrings = require('LocalizedStrings').default;

const strings = new LocalizedStrings({
    zh: {
        auth: {
            handle: "用户名",
            password: "密码",
            handleRequired: "用户名不能为空",
            passwordRequired: "密码不能为空",
            loginFailed: "登录失败：",
            unauthorized: "用户名或密码错误",
            
            registerFailed: "注册失败：",
            alreadyExists: "用户名已存在",
            cannotEmpty: "用户名与密码不能为空",
            
        },
        // fridge: {
        //   egg: "Egg",
        //   milk: "Milk",
        // }
    },
    en: {
        auth:
        {
            handle: "Handle",
            password: "Password",
            handleRequired: "Handle is required",
            passwordRequired: "Password is required",
            loginFailed: "login failed: ",
            unauthorized: "handle or password incorrect",
            
            registerFailed: "register failed: ",
            alreadyExists: "user handle already exists",
            cannotEmpty: "handle or password cannot be empty",
        }
        // fridge: {
        //   egg: "Uovo",
        //   milk: "Latte",
        // }
    }
},
);

export default strings;