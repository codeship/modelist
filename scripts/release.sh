#!/bin/bash
set -e

if [[ -z $1 ]]; then
  CURRENT_VERSION=$(node -p -e "require('./package.json').version")
  echo "Enter new version: (currently $CURRENT_VERSION)"
  read -r VERSION
else
  VERSION=$1
fi

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  npm version "$VERSION"
  npm publish --otp=$(op get totp npm)
else
    echo "Release aborted!"
fi
