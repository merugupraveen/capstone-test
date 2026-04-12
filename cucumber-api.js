module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["src/support/**/*.ts", "tests/api/steps/**/*.ts"],
    paths: ["tests/api/features/**/*.feature"],
    format: ["progress-bar", "html:reports/api-cucumber-report.html"],
    parallel: 1
  }
};
