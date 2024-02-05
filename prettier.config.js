module.exports = {
	overrides: [
		{
			files: ["./*.ts", "./*.tsx", "./*.json", "src/**/*.ts", "src/**/*.tsx", "src/**/*.scss", "./*.js"],
			options: {
				tabWidth: 2,
				useTabs: true,
				singleQuote: false,
				trailingComma: "all",
				printWidth: 180,
				semi: true,
				bracketSameLine: true,
			},
		},
	],
};
