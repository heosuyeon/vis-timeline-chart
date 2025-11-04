const fs = require("fs");
const path = require("path");

const sourceFile = path.join(__dirname, "..", "THIRD_PARTY_LICENSES.md");
const destDir = path.join(__dirname, "..", "build");
const destFile = path.join(destDir, "THIRD_PARTY_LICENSES.md");

// build 디렉토리가 존재하는지 확인
if (!fs.existsSync(destDir)) {
  console.error(
    'Build directory does not exist. Please run "npm run build" first.'
  );
  process.exit(1);
}

// 파일 복사
try {
  fs.copyFileSync(sourceFile, destFile);
  console.log("✓ THIRD_PARTY_LICENSES.md copied to build directory");
} catch (error) {
  console.error("Error copying THIRD_PARTY_LICENSES.md:", error.message);
  process.exit(1);
}
