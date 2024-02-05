# quizzer-llm-api

# Description

This is a simple example of how to use the Ollama SDK to communicate with a model.
It involves a model prompting and answering questions as stream.

- It uses the `ollama` package to communicate with the model.
- It uses the mistral:instruct model which is light enough to run on a CPU.

# Features

- Prompt the model with a set of instructions using [INST] and [/INST] tags handled by the model
- Ask the model questions even if that goes against instructions to try knowledge boundaries
- Print in console the model's answers as a stream
- Format the model's answers as JSON

**Note**: This is a MVP, it's needs to be improved (see Leftovers below), and prompting adaptation to use cases. But it's a good start.

# Prerequisites

- Docker
- Node.js v20+

# Installation

- Clone the repository
- Run `docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama`to start the ollama server (or `docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama` for NVidia GPU usage which will improve performances by far, see Documentation section below)
- Run `docker exec -it ollama ollama run mistral:instruct` to start the mistral:instruct model
- Run `npm install` to install the dependencies
- Run `npm start` to start the application
- The application includes a .vscode configuration to run the application in debug mode.

# Leftovers

- Customization of the model to use.
- Usage as an http API instead of console.

# Documentations

- [Ollama](https://ollama.com/)
- [Ollama mistral models](https://ollama.ai/library/mistral)
- [Ollama mistral:instruct model](https://ollama.ai/library/mistral:instruct)
- [Ollama SDK](https://github.com/ollama/ollama-js)
- [Ollama and docker](https://ollama.ai/blog/ollama-is-now-available-as-an-official-docker-image)
- [Mistral:instruct model](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)
