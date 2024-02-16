# quizzer-llm

---

# Description

This is an application using a LLM model to play a quizz.
The application is deployed and available [here](https://quizzer-llm.rael-calitro.ovh/)

- It uses the `ollama` package to communicate with the model.
- It uses the mistral:instruct model which is light enough to run on a CPU.
- It runs a node.js (Fastify) server to communicate with the model and a web client (React) to interact with the server.
- It uses a docker container to run the model.

# Features

- Prompt the model with a set of instructions
- Ask the model questions
- Analyze the answers of users by model
- Format the model's responses as JSON

# Prerequisites

- Docker
- Node.js v20+

# Environment variables

### Api:

- ENVIRONMENT=local # Environment variables for the UI: 'local' or 'production'
- HOST=localhost
- PORT=3099
- OLLAMA_API_URL=http://localhost:11434 # If using docker, the IP address of the container running the ollama server (i.e: 172.17.0.2)

### UI:

REACT_APP_ENV=local # Environment variables for the UI: 'local' or 'production'

---

# Installation

- Clone the repository
- Run `docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama`to start the ollama server (or `docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama` for NVidia GPU usage which will improve performances by far, see Documentation section below)

If you want to run the application via docker, you can skip the next steps until the "Run the application" section.

- Run `npm install` to install the dependencies
- `npm install` can be run on the UI application and API server separately.

# Build the application

If you want to run the UI application and API server separately locally, you can skip this step

- Run `npm run build` to build the application

# Run the application

If you want to run the application via docker, you just have to run:

- `docker build -t quizzer-llm .`
- `docker run -d -p 3099:3099 --name quizzer-llm quizzer-llm`

Otherwise:

- Run `npm start` to start the application
- The application includes a .vscode configuration to run the application in debug mode.
- To start the UI application and API server separately, run `npm run start:ui` and `npm run start:api` respectively.

---

# Documentations

- [Ollama](https://ollama.com/)
- [Ollama mistral models](https://ollama.ai/library/mistral)
- [Ollama mistral:instruct model](https://ollama.ai/library/mistral:instruct)
- [Ollama SDK](https://github.com/ollama/ollama-js)
- [Ollama and docker](https://ollama.ai/blog/ollama-is-now-available-as-an-official-docker-image)
- [Mistral:instruct model](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)
- [Mistral models](https://docs.mistral.ai/models/)

When sharing your proof of concept (POC) project publicly, it's indeed wise to explain the scope, design choices, and any shortcuts you took. This context can help others understand your intentions, the project's purpose, and its limitations. Here's a suggestion for how you might draft that section of your README:

---

# Project Overview and Design Choices

This project serves as a proof of concept (POC) application around leveraging a Large Language Model (LLM) to power a quiz maker. It's designed to explore the capabilities of LLMs within a specific application context and to demonstrate a practical implementation.

### Key Design Choices:

- **Simplicity Over Complexity:** To maintain focus on the core functionality and ensure the codebase remains approachable, I've intentionally skipped implementing certain architectural patterns such as dependency injection or domain-driven design. Given the project's scope as a POC, these patterns were deemed unnecessary and could potentially obscure the learning objectives.

- **No DTO Mapper:** Objects in this project do not contain any sensitive information; therefore, a Data Transfer Object (DTO) mapper was not utilized. This decision was made to streamline the code and focus on the interaction with the LLM.

- **Testing:** Automated tests have been omitted. This project is not intended for production use, and its primary goal is exploratory. Including tests would increase complexity without significant benefits for the project's learning and demonstration goals.

### Project Intentions:

This POC was created in a short amount of time (couple of days on my free time) with two main objectives:

1. **Learning:** To gain hands-on experience with Large Language Models and understand how they can be integrated into application development.
2. **Sharing:** To contribute a simple, yet functional example of using LLMs within a software project to the community.

### Note on Production Readiness:

Please be aware that this project is not designed with production use in mind. It serves as an educational tool and a starting point for discussions and further experimentation. As such, certain best practices commonly associated with production-ready software (such as comprehensive testing and adherence to specific architectural principles) have been intentionally omitted to keep the focus on the core learning objectives.

### Feedback and Questions:

I welcome feedback and questions on this project! It's shared in the spirit of learning and collaboration. If you have any questions or suggestions, or if you'd like to discuss the project further, please feel free to contact me.

---

# Author

- Made with ❤️ by [Rael CALITRO](https://rael-calitro.ovh)
- [LinkedIn](https://www.linkedin.com/in/rael-calitro-4a519a187/)

---

# License

The MIT License (MIT)

Copyright (c) 2024 Rael CALITRO, Inc. and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
