#!/usr/bin/env bash
GIT_SHA=$(git rev-parse master)
docker build -f ../Dockerfile_asgi -t gcr.io/debugbox/debug_box_django_asgi:$GIT_SHA ../
