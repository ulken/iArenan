#!/usr/bin/env bash

SDK="iphoneos"
BUILD_TYPE="Release"

PROJECT="iArenan"
PROJECT_DIR="platforms/ios"
PROJECT_FILE="${PROJECT_DIR}/${PROJECT}.xcodeproj"
TMP_DIR="/tmp/${PROJECT}"
TMP_BUILD_PRODUCT_DIR="${TMP_DIR}/Build/Products/${BUILD_TYPE}-${SDK}"
BUILD_DIR="${PROJECT_DIR}/build/${PROJECT}.build"
APP_DIR="${BUILD_DIR}/${BUILD_TYPE}-${SDK}/${PROJECT}.app"
APP_BINARY="${APP_DIR}/${PROJECT}"

REMOTE_HOST="root@192.168.1.2"
REMOTE_INSTALL_DIR="/Applications"

set -e

echo 'Building project...'
xcodebuild -project "${PROJECT_FILE}" -scheme "${PROJECT}" -sdk "${SDK}" -derivedDataPath "${TMP_DIR}" -configuration "${BUILD_TYPE}" clean build CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO > /dev/null

echo 'Extracting build product...'
cp -rf "${TMP_BUILD_PRODUCT_DIR}" "${BUILD_DIR}"

echo 'Signing binary...'
codesign -fs "Selfsigning" "${APP_BINARY}"

echo 'Installing on device...'
scp -r "${APP_DIR}" "${REMOTE_HOST}:${REMOTE_INSTALL_DIR}" > /dev/null

echo 'Refreshing UI cache...'
ssh "${REMOTE_HOST}" "su mobile -c uicache"

echo 'Cleaning up...'
rm -r "${TMP_DIR}"

echo 'Done!'
