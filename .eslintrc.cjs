module.exports = {
  extends: ["next", "next/core-web-vitals"],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          { name: '@demo', message: 'Demo code can only be used under /app/demo.' },
          { name: 'app/demo/_data/mockData', message: 'mockData is demo-only. Use lib/repos/* instead.' },
          { name: 'app/demo/_state/demoStore', message: 'Demo store is demo-only.' }
        ],
        patterns: ['app/demo/*']
      }
    ]
  },
  overrides: [
    {
      files: ["app/demo/**/*.{ts,tsx,js,jsx}"],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
};
