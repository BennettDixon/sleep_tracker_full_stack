#!/usr/bin/env bash
GIT_SHA=$(git rev-parse master)
docker build -f ../Dockerfile_wsgi -t gcr.io/debugbox/debug_box_django_wsgi:$GIT_SHA ../
