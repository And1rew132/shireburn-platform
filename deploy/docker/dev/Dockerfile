# syntax=docker/dockerfile:1.7
FROM node:22.12-bookworm
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update   && apt-get install -y --no-install-recommends      ca-certificates      curl      git      jq      openssh-client   && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

ENV NODE_ENV=development     NUXT_TELEMETRY_DISABLED=1     STORYBOOK_DISABLE_TELEMETRY=1     FORCE_COLOR=1     PATH="/workspace/node_modules/.bin:${PATH}"

CMD ["bash"]
