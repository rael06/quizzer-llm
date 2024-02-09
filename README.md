# quizzer-llm

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

ENVIRONMENT=local # Environment variables for the UI: 'local' or 'production'
HOST=localhost
PORT=3099
OLLAMA_API_URL=http://localhost:11434 # If using docker, the IP address of the container running the ollama server (i.e: 172.17.0.2)

### UI:

REACT_APP_ENV=local # Environment variables for the UI: 'local' or 'production'

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

# Documentations

- [Ollama](https://ollama.com/)
- [Ollama mistral models](https://ollama.ai/library/mistral)
- [Ollama mistral:instruct model](https://ollama.ai/library/mistral:instruct)
- [Ollama SDK](https://github.com/ollama/ollama-js)
- [Ollama and docker](https://ollama.ai/blog/ollama-is-now-available-as-an-official-docker-image)
- [Mistral:instruct model](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)

# Author

- Made with ❤️ by [Rael CALITRO](https://rael-calitro.ovh)
- [LinkedIn](https://www.linkedin.com/in/rael-calitro-4a519a187/)

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
