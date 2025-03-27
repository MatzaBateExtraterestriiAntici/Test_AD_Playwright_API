const fs = require('fs');
const path = require('path');

// Paths to the JSON report and GitHub Actions Summary
const jsonReportPath = path.resolve(__dirname, '..', 'playwright-reports', 'json-report', 'results.json');
const summaryPath = process.env.GITHUB_STEP_SUMMARY;

// Check if JSON report exists
if (!fs.existsSync(jsonReportPath)) {
    console.error(`❌ Playwright JSON report not found at: ${jsonReportPath}`);
    process.exit(1);
}

// Read and parse the JSON report
const report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));

// Extract test details
let summary = `# ✅ Playwright Test Summary\n\n`;

jsonData.suites.forEach(suite => {
    suite.suites.forEach(subSuite => {
        subSuite.specs.forEach(spec => {
            let testTitle = spec.title;
            let statusEmoji = spec.tests.some(t => t.status === 'failed') ? '❌' : '✅';
            let project = spec.tests[0].projectName;
            let testFile = spec.file;
            let startTime = spec.tests[0].results[0]?.startTime || 'N/A';
            let apiCallStart = 'N/A';
            let apiCallEnd = 'N/A';
            let apiDuration = 'N/A';

            // Extract API execution details from stdout
            spec.tests[0].results[0].stdout.forEach(log => {
                if (log.text.includes('API call START')) {
                    apiCallStart = log.text.match(/API call START: (.+)\n/)[1] || 'N/A';
                }
                if (log.text.includes('API call END')) {
                    apiCallEnd = log.text.match(/API call END: (.+)\n/)[1] || 'N/A';
                }
                if (log.text.includes('API call DURATION')) {
                    apiDuration = log.text.match(/API call DURATION: (.+)\n/)[1] || 'N/A';
                }
            });

            summary += `
    ## ${statusEmoji} ${testTitle}

    - **Project**: ${project}  
    - **Test File**: \`${testFile}\`  
    - **Start Time**: ${startTime}  
    - **API Call Start**: ${apiCallStart}  
    - **API Call End**: ${apiCallEnd}  
    - **API Call Duration**: ${apiDuration}  

    ### 🔍 Validation Checks:
    `;

            spec.tests[0].results[0].stdout.forEach(log => {
                if (log.text.includes('Equal validation attempted')) {
                    summary += `  - ${log.text.trim()}\n`;
                }
            });

            summary += `\n---\n`;
        });
    });
});

// Write the summary to GitHub Actions Summary
fs.appendFileSync(summaryPath, summary);
console.log('✅ GitHub Actions Summary Updated!');
