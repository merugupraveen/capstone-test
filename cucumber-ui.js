module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["src/support/**/*.ts", "tests/ui/steps/**/*.ts"],
    paths: ["tests/ui/features/**/*.feature"],
    format: ["progress-bar", "html:reports/ui-cucumber-report.html"],
    parallel: 1
  }
};
