const fs = require('fs');
const path = require('path');

const reportPath = path.resolve(__dirname, '..', 'playwright-reports', 'json-report', 'results.json');
const summaryPath = process.env.GITHUB_STEP_SUMMARY; // GitHub Actions Summary File

if (!fs.existsSync(reportPath)) {
    console.error(`❌ Playwright report not found at: ${reportPath}`);
    process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

const passed = report.suites.flatMap(suite => suite.specs).filter(spec => spec.tests.every(test => test.status === 'passed')).length;
const failed = report.suites.flatMap(suite => suite.specs).filter(spec => spec.tests.some(test => test.status === 'failed')).length;
const total = passed + failed;

const summary = `
# 📝 Playwright Test Summary

| Status  | Count |
|---------|-------|
| ✅ Passed | ${passed} |
| ❌ Failed | ${failed} |
| 🔢 Total  | ${total} |

🔗 **[Full Playwright Report](./playwright-reports/html-report/index.html)**
`;

fs.appendFileSync(summaryPath, summary);
console.log('✅ GitHub Actions Summary Updated!');
