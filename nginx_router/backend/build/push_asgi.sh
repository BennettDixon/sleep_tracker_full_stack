#!/usr/bin/env bash
GIT_SHA=$(git rev-parse master)
docker push gcr.io/debugbox/debug_box_django_asgi:$GIT_SHA

