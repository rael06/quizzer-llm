const { exec } = require("child_process");

const runCommand = (command) => {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
				reject(error);
			}
			resolve(stdout ? stdout : stderr);
		});
	});
};

(async () => {
	try {
		console.info("Deploy started..");

		console.info("\nStep 1/6");
		console.info("Pull started..");
		await runCommand("git pull");
		console.info("Pull executed successfully.");

		console.info("\nStep 2/6");
		console.info("Stop container started..");
		await runCommand("docker stop quizzer-llm").catch(() => console.error("Error stopping container"));
		console.info("Stop container successful.");

		console.info("\nStep 3/6");
		console.info("Remove container started..");
		await runCommand("docker rm quizzer-llm").catch(() => console.error("Error removing container"));
		console.info("Remove container successful.");

		console.info("\nStep 4/6");
		console.info("Remove image started..");
		await runCommand("docker rmi quizzer-llm").catch(() => console.error("Error removing image"));
		console.info("Remove image successful.");

		console.info("\nStep 5/6");
		console.info("Build started..");
		await runCommand("docker build -t quizzer-llm .").catch((e) => console.error("Error building image", e));
		console.info("Build successful.");

		console.info("\nStep 6/6");
		console.info("Run container started..");
		await runCommand("docker run -d -p 3099:3099 --name quizzer-llm quizzer-llm").catch((e) => console.error("Error running container", e));
		console.info("Run container successful.");

		console.info("\n");
		console.info("Deploy successful.");
	} catch (error) {
		console.error("An error occurred:", error);
	}
})();
