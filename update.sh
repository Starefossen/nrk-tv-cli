#!/usr/bin/env bash

CLI_HELP=$(docker-compose run --rm node node index.js --help)
CLI_HELP=$(echo -ne "$CLI_HELP")

CLI_SEARCH=$(docker-compose run --rm node node index.js search --help)
CLI_SEARCH=$(echo -ne "$CLI_SEARCH")

CLI_EPISODES=$(docker-compose run --rm node node index.js episodes --help)
CLI_EPISODES=$(echo -ne "$CLI_EPISODES")

CLI_EPISODE=$(docker-compose run --rm node node index.js episode --help)
CLI_EPISODE=$(echo -ne "$CLI_EPISODE")

template=$(cat README.template)
template=$(echo "${template//__CLI_HELP__/${CLI_HELP}}")
template=$(echo "${template//__CLI_SEARCH__/${CLI_SEARCH}}")
template=$(echo "${template//__CLI_EPISODES__/${CLI_EPISODES}}")
template=$(echo "${template//__CLI_EPISODE__/${CLI_EPISODE}}")

echo -ne "${template}" > README.md
