import { createRouter, createWebHistory } from "vue-router";
import { Register, Login, ResetForm } from "./components/main/index.js";
import {
    MyBooks,
    AccountDelete,
    RequestForm,
    FeedbackAddOrEdit
} from "./components/user/index.js";
import {
    Requests,
    SectionAddOrEdit,
    BookAddOrEdit,
    Export
} from "./components/librarian/index.js";
import {
    Layout,
    Account,
    PasswordReset,
    AccountEdit,
    AccountChange,
    Section,
    Search,
    Books,
    Book,
    Stats,
    Sections,
    BookView,
    NotFound,
    DummyComponent
} from "./components/common/index.js";
import { integerChecker, notify } from "./components/utils/utils.js";

const routes = [
    {
        path: "/user",
        component: Layout,
        props: { role: "user" },
        meta: { requiresAuth: true, role: "user", title: "User" },
        children: [
            {
                path: "",
                redirect: "/user/sections"
            },
            {
                path: "dummy",
                component: DummyComponent
            },
            {
                path: "sections",
                component: Sections,
                props: { role: "user" },
                meta: { activeFor: "sections", title: "Sections" }
            },
            {
                path: "section/:sectionid",
                component: Section,
                beforeEnter: integerChecker("sectionid"),
                props: (route) => ({
                    role: "user",
                    sectionid: Number(route.params.sectionid)
                }),
                meta: { activeFor: "sections", title: "Section" }
            },
            {
                path: "books",
                component: Books,
                props: { role: "user" },
                meta: { activeFor: "books", title: "Books" }
            },
            {
                path: "search",
                component: Search,
                props: { role: "user" },
                meta: { title: "Search" }
            },
            {
                path: "book/:bookid",
                beforeEnter: integerChecker("bookid"),
                children: [
                    {
                        path: "",
                        component: Book,
                        props: (route) => ({
                            role: "user",
                            bookid: Number(route.params.bookid)
                        }),
                        meta: { activeFor: "books", title: "Book" }
                    },
                    {
                        path: "view",
                        component: BookView,
                        props: (route) => ({
                            role: "user",
                            bookid: Number(route.params.bookid)
                        }),
                        meta: { activeFor: "books", title: "Book View" }
                    }
                ]
            },
            {
                path: "request/:bookid",
                component: RequestForm,
                beforeEnter: integerChecker("bookid"),
                props: (route) => ({
                    bookid: Number(route.params.bookid)
                }),
                meta: { activeFor: "books", title: "Book Request" }
            },
            {
                path: "feedback/:bookid/add",
                component: FeedbackAddOrEdit,
                beforeEnter: integerChecker("bookid"),
                props: (route) => ({
                    role: "add",
                    bookid: Number(route.params.bookid)
                }),
                meta: { activeFor: "books", title: "Feedback" }
            },
            {
                path: "feedback/:feedbackid/edit",
                component: FeedbackAddOrEdit,
                beforeEnter: integerChecker("feedbackid"),
                props: (route) => ({
                    role: "edit",
                    feedbackid: Number(route.params.feedbackid)
                }),
                meta: { activeFor: "books", title: "Feedback" }
            },
            {
                path: "mybooks",
                component: MyBooks,
                meta: { activeFor: "mybooks", title: "MyBooks" }
            },
            {
                path: "stats",
                component: Stats,
                props: { role: "user" },
                meta: { activeFor: "stats", title: "Statistics" }
            },
            {
                path: "account",
                children: [
                    {
                        path: "",
                        component: Account,
                        props: { role: "user" },
                        meta: { activeFor: "account", title: "Account" }
                    },
                    {
                        path: "edit",
                        component: AccountEdit,
                        props: { role: "user" },
                        meta: { activeFor: "account", title: "Edit Profile" }
                    },
                    {
                        path: "change",
                        component: AccountChange,
                        props: { role: "user" },
                        meta: { activeFor: "account", title: "Change Password" }
                    },
                    {
                        path: "password-reset/:token",
                        component: PasswordReset,
                        props: (route) => ({
                            role: "",
                            token: route.params.token
                        }),
                        meta: { activeFor: "account", title: "Password Reset" }
                    },
                    {
                        path: "delete",
                        component: AccountDelete,
                        meta: { activeFor: "account", title: "Delete Account" }
                    }
                ]
            },
            {
                path: "not-found",
                component: NotFound,
                meta: { title: "404 Not Found" }
            }
        ]
    },
    {
        path: "/librarian",
        component: Layout,
        props: { role: "librarian" },
        meta: { requiresAuth: true, role: "librarian", title: "Librarian" },
        children: [
            {
                path: "",
                redirect: "/librarian/sections"
            },
            {
                path: "dummy",
                component: DummyComponent
            },
            {
                path: "sections",
                component: Sections,
                props: { role: "librarian" },
                meta: { activeFor: "sections", title: "Sections" }
            },
            {
                path: "section/add",
                component: SectionAddOrEdit,
                props: { role: "add" },
                meta: { activeFor: "sections", title: "Add Section" }
            },
            {
                path: "section/:sectionid",
                beforeEnter: integerChecker("sectionid"),
                children: [
                    {
                        path: "",
                        component: Section,
                        props: (route) => ({
                            role: "librarian",
                            sectionid: Number(route.params.sectionid)
                        }),
                        meta: { activeFor: "sections", title: "Section" }
                    },
                    {
                        path: "add",
                        component: BookAddOrEdit,
                        props: (route) => ({
                            role: "add",
                            sectionid: Number(route.params.sectionid)
                        }),
                        meta: { activeFor: "books", title: "Add Book" }
                    },
                    {
                        path: "edit",
                        component: SectionAddOrEdit,
                        props: (route) => ({
                            role: "edit",
                            sectionid: Number(route.params.sectionid)
                        }),
                        meta: { activeFor: "sections", title: "Edit Section" }
                    }
                ]
            },
            {
                path: "books",
                component: Books,
                props: { role: "librarian" },
                meta: { activeFor: "books", title: "Books" }
            },
            {
                path: "search",
                component: Search,
                props: { role: "librarian" },
                meta: { title: "Search" }
            },
            {
                path: "book/:bookid",
                beforeEnter: integerChecker("bookid"),
                children: [
                    {
                        path: "",
                        component: Book,
                        props: (route) => ({
                            role: "librarian",
                            bookid: Number(route.params.bookid)
                        }),
                        meta: { activeFor: "books", title: "Books" }
                    },
                    {
                        path: "edit",
                        component: BookAddOrEdit,
                        props: (route) => ({
                            role: "edit",
                            bookid: Number(route.params.bookid)
                        }),
                        meta: { activeFor: "books", title: "Edit Book" }
                    },
                    {
                        path: "view",
                        component: BookView,
                        props: (route) => ({
                            role: "librarian",
                            bookid: Number(route.params.bookid)
                        }),
                        meta: { activeFor: "books", title: "View Book" }
                    }
                ]
            },
            {
                path: "export",
                component: Export,
                meta: { activeFor: "requests", title: "Export" }
            },
            {
                path: "requests",
                component: Requests,
                meta: { activeFor: "requests", title: "Requests" }
            },
            {
                path: "stats",
                component: Stats,
                props: { role: "librarian" },
                meta: { activeFor: "stats", title: "Statistics" }
            },
            {
                path: "account",
                children: [
                    {
                        path: "",
                        component: Account,
                        props: { role: "librarian" },
                        meta: { activeFor: "account", title: "Account" }
                    },
                    {
                        path: "edit",
                        component: AccountEdit,
                        props: { role: "librarian" },
                        meta: { activeFor: "account", title: "Edit Profile" }
                    },
                    {
                        path: "change",
                        component: AccountChange,
                        props: { role: "librarian" },
                        meta: { activeFor: "account", title: "Change Password" }
                    },
                    {
                        path: "password-reset/:token",
                        component: PasswordReset,
                        props: (route) => ({
                            role: "librarian",
                            token: route.params.token
                        }),
                        meta: { activeFor: "account", title: "Reset Password" }
                    }
                ]
            },
            {
                path: "not-found",
                component: NotFound,
                meta: { title: "404 Not Found" }
            }
        ]
    },
    {
        path: "/",
        component: Layout,
        props: { role: "" },
        meta: { requiresAuth: false, role: "", title: "Main" },
        children: [
            {
                path: "",
                redirect: "/sections"
            },
            {
                path: "dummy",
                component: DummyComponent
            },
            {
                path: "sections",
                component: Sections,
                props: { role: "" },
                meta: { activeFor: "sections", title: "Sections" }
            },
            {
                path: "search",
                component: Search,
                props: { role: "" },
                meta: { title: "Search" }
            },
            {
                path: "section/:sectionid",
                component: Section,
                beforeEnter: integerChecker("sectionid"),
                props: (route) => ({
                    role: "",
                    sectionid: Number(route.params.sectionid)
                }),
                meta: { activeFor: "sections", title: "Section" }
            },
            {
                path: "book/:bookid",
                component: Book,
                beforeEnter: integerChecker("bookid"),
                props: (route) => ({
                    role: "",
                    bookid: Number(route.params.bookid)
                }),
                meta: { activeFor: "books", title: "Book" }
            },
            {
                path: "books",
                component: Books,
                props: { role: "" },
                meta: { activeFor: "books", title: "Books" }
            },
            {
                path: "register",
                component: Register,
                meta: { activeFor: "login", title: "Register" }
            },
            {
                path: "request-reset",
                component: ResetForm,
                meta: { activeFor: "login", title: "Request Reset" }
            },
            {
                path: "password-reset/:token",
                component: PasswordReset,
                props: (route) => ({
                    role: "",
                    token: route.params.token
                }),
                meta: { activeFor: "login", title: "Password Reset" }
            },
            {
                path: "login",
                component: Login,
                props: { role: "user" },
                meta: { activeFor: "login", title: "Login" }
            },
            {
                path: "lib-login",
                component: Login,
                props: { role: "librarian" },
                meta: { activeFor: "login", title: "Librarian Login" }
            },
            {
                path: "not-found",
                component: NotFound,
                meta: { title: "404 Not Found" }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const userToken = localStorage.getItem("userToken");
    const userRole = localStorage.getItem("userRole");
    if (to.matched.some((record) => record.meta?.requiresAuth)) {
        if (!userToken || !userRole) {
            notify("Please login.", "error");
            next("/login");
        } else if (to.meta?.role && userRole && userRole !== to.meta?.role) {
            notify("Unauthorized Access.", "warning");
            next(`/${userRole}/sections`);
        } else {
            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/api/common/is-valid",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`
                        }
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data.error || "An unexpected error occurred."
                    );
                }
                document.title = to.meta?.title || "Library App";
                next();
            } catch (error) {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userRole");
                notify("Your session expired. Please login again.", "error");
                const path = userRole === "librarian" ? "/lib-login" : "/login";
                next(path);
            }
        }
    } else {
        if (userToken && userRole) {
            if (
                to.path === "/login" ||
                to.path === "/register" ||
                to.path === "/lib-login"
            ) {
                try {
                    const response = await fetch(
                        "http://127.0.0.1:5000/api/common/logout",
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem(
                                    "userToken"
                                )}`
                            }
                        }
                    );
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(
                            data.error || "An unexpected error occurred."
                        );
                    }
                    localStorage.removeItem("userToken");
                    localStorage.removeItem("userRole");
                    notify(
                        data?.message +
                            ` Redirecting to ${
                                to.path === "/login"
                                    ? "Login"
                                    : to.path === "/lib-login"
                                    ? "Librarian Login"
                                    : "Register"
                            } page.`,
                        "success"
                    );
                    next();
                } catch (error) {
                    notify(error.message || error, "error");
                }
            } else if (
                to.matched.some((record) => !record.meta?.requiresAuth)
            ) {
                notify("You are logged in.", "warning");
                next(`/${userRole}/sections`);
            } else {
                next(`/${userRole}/not-found`);
            }
        } else if (to.matched.some((record) => !record.meta?.requiresAuth)) {
            document.title = to.meta?.title || "Library App";
            next();
        } else {
            next("/not-found");
        }
    }
});

export { router };
