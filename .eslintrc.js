module.exports = {
  root: true,
  env: {
    node: true
  },
  rules: {
    quotes: ['error', 'single'],
    "no-console": "off",
    semi: 0,
    eqeqeq: 0,
    "no-undef": 0,
    "eol-last": 0,
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "arrow-parens": 0,
    "no-unused-vars": 0,
    "generator-star-spacing": 0,
    "space-before-function-paren": 0
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: ["plugin:vue/essential"]
};