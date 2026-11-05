#!/bin/bash

set -euo pipefail

: "${1:?config file not set, aborting.}"

# shellcheck source=/dev/null
. "$1"

: "${GITHUB_TOKEN:?not set, aborting.}"
: "${DEPLOYMENT:?not set, aborting.}"
: "${APP_NAME:?not set, aborting.}"
: "${DATABASE_URL:?not set, aborting.}"

function check_command () {
    : "${1:?parameter not set, aborting.}"

    if ! command -v "$1" >/dev/null 2>&1; then
        echo "$1 could not be found"
        exit 1
    fi
}

check_command "jq"
check_command "curl"
check_command "tar"
check_command "npm"
check_command "supervisorctl"

pushd "$DEPLOYMENT" >/dev/null

CURRENT_VERSION=$(cat ./.version 2>/dev/null || echo 0)

curl --silent --request GET \
    --url "https://api.github.com/repos/seneca-camp/seneca-sessions/releases/latest" \
    --header "Authorization: Bearer $GITHUB_TOKEN" \
    --output ./.latest

LATEST_VERSION=$(cat ./.latest | jq -r ".tag_name")

if [[ "$CURRENT_VERSION" == "$LATEST_VERSION" ]]; then
    # Latest and current release versions match, there's nothing to do
    # No info output either, would get sent via mail
    rm ./.latest
    popd >/dev/null
    exit 0
fi

TARBALL=$(cat ./.latest | jq -r ".assets |= map(select(.name | contains (\"seneca-sessions\")))[0] | .assets.url")

curl --silent --location \
    --request GET \
    --url "$TARBALL" \
    --header "Authorization: Bearer $GITHUB_TOKEN" \
    --header "Accept: application/octet-stream" \
    --output ./seneca-sessions.tar.gz

rm ./.latest
supervisorctl stop "$APP_NAME"
mv ./app "./$CURRENT_VERSION" 2>/dev/null || true
mkdir -p ./app
tar -xf ./seneca-sessions.tar.gz -C ./app
pushd app >/dev/null
npm ci --omit=dev --omit=optional >/dev/null
env DATABASE_URL="$DATABASE_URL" npm run db:migrate >/dev/null
popd >/dev/null
echo "$LATEST_VERSION" > ./.version
supervisorctl start "$APP_NAME"

popd >/dev/null

