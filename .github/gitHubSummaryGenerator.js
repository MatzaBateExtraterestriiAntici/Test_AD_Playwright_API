const fs = require("fs");
const path = require("path");

const jsonReportPath = path.join(__dirname, "playwright-reports/json-report/results.json");
const githubSummaryPath = process.env.GITHUB_STEP_SUMMARY;

function extractSummary(reportPath) {
    if (!fs.existsSync(reportPath)) {
        console.error("❌ Playwright JSON report not found!");
        return "";
    }

    const rawData = fs.readFileSync(reportPath, "utf8");
    const jsonData = JSON.parse(rawData);

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;
    const browserResults = {};

    jsonData.suites.forEach(suite => {
        suite.specs.forEach(spec => {
            spec.tests.forEach(test => {
                totalTests++;
                const result = test.results[0];
                const browser = result.browserName;

                if (!browserResults[browser]) {
                    browserResults[browser] = { total: 0, passed: 0, failed: 0, skipped: 0 };
                }

                browserResults[browser].total++;
                
                if (result.status === "passed") {
                    passedTests++;
                    browserResults[browser].passed++;
                } else if (result.status === "failed") {
                    failedTests++;
                    browserResults[browser].failed++;
                } else if (result.status === "skipped") {
                    skippedTests++;
                    browserResults[browser].skipped++;
                }
            });
        });
    });

    let summary = "### 🚀 Playwright Test Summary\n\n";
    summary += `**Total Tests:** ${totalTests}  \n`;
    summary += `✅ **Passed:** ${passedTests}  \n`;
    summary += `❌ **Failed:** ${failedTests}  \n`;
    summary += `⏭️ **Skipped:** ${skippedTests}  \n\n`;

    summary += "| 🌐 Browser | 📝 Total | ✅ Passed | ❌ Failed | ⏭️ Skipped |\n";
    summary += "|-----------|------|--------|--------|--------|\n";

    Object.keys(browserResults).forEach(browser => {
        const { total, passed, failed, skipped } = browserResults[browser];
        summary += `| ${browser} | ${total} | ${passed} | ${failed} | ${skipped} |\n`;
    });

    return summary;
}

// Generate and write summary to GitHub Actions summary page
const summaryContent = extractSummary(jsonReportPath);
if (summaryContent && githubSummaryPath) {
    fs.writeFileSync(githubSummaryPath, summaryContent);
    console.log("✅ Test summary written to GitHub Summary Page.");
} else {
    console.error("⚠️ Failed to generate test summary.");
}
