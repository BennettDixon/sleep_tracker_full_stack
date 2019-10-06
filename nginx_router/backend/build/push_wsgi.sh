#!/usr/bin/env bash
GIT_SHA=$(git rev-parse master)
docker push gcr.io/debugbox/debug_box_django_wsgi:$GIT_SHA

