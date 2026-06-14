const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const logger = {
  info: (message) => {
    console.log(`${colors.blue}ℹ️  [INFO]${colors.reset} ${message}`);
  },

  success: (message) => {
    console.log(`${colors.green}✅ [SUCCESS]${colors.reset} ${message}`);
  },

  warn: (message) => {
    console.log(`${colors.yellow}⚠️  [WARN]${colors.reset} ${message}`);
  },

  error: (message) => {
    console.log(`${colors.red}❌ [ERROR]${colors.reset} ${message}`);
  },

  debug: (message) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`${colors.cyan}🔍 [DEBUG]${colors.reset} ${message}`);
    }
  },
};

export default logger;