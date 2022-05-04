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
            remember: "7天内自动登录",
            forgotPw: "忘记密码？",

        },
        nav: {
            dashboard: "首页",
            problem: "题库",
            login: "登录",
            register: "注册",
        },
        problem: {
            status: "状态",
            code: "题号",
            title: "题目名称",
            tags: "标签",
            difficulty: "难度",
            accuracy: "通过率",
            submitted: "提交数",
            solved: "通过数",
            page: "页数：",
            setPageHint: "跳转到：",
        }
    },
    en: {
        auth: {
            handle: "Handle",
            password: "Password",
            handleRequired: "Handle is required",
            passwordRequired: "Password is required",
            loginFailed: "login failed: ",
            unauthorized: "handle or password incorrect",

            registerFailed: "register failed: ",
            alreadyExists: "user handle already exists",
            cannotEmpty: "handle or password cannot be empty",
            remember: "Remember me for 7 days",
            forgotPw: "Forgot password?",


        },
        nav: {
            dashboard: "dashboard",
            problem: "problem",
            login: "login",
            register: "register",
        },
        problem: {
            status: "status",
            code: "problem code",
            title: "title",
            tags: "tags",
            difficulty: "difficulty",
            accuracy: "accuracy",
            submitted: "submitted",
            solved: "solved",
            page: "page: ",
            setPageHint: "jump to page: ",

        }
    }
},
);

export default strings;