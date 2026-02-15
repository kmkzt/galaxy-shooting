#!/usr/bin/env bash
set -euo pipefail

# gh-pagesブランチにファイルをデプロイするスクリプト。
#
# 必須環境変数:
#   GITHUB_TOKEN       - GitHubトークン
#   GITHUB_REPOSITORY  - リポジトリ名 (owner/repo)
#
# 使い方:
#   deploy-to-pages.sh deploy <source_dir> [--subdir <dir>] [--message <msg>] [--branch <branch>]
#   deploy-to-pages.sh cleanup <subdir> [--message <msg>] [--branch <branch>]
#
# deploy モード:
#   source_dir のファイルをデプロイブランチにコピーする。
#   --subdir を指定した場合はそのサブディレクトリにコピー。
#   --subdir を省略した場合はルートにコピー（pr/ ディレクトリは保持）。
#
# cleanup モード:
#   指定したサブディレクトリを削除する。
#   親ディレクトリが空になった場合は親も削除する。

MODE="${1:-}"
SOURCE_DIR=""
SUBDIR=""
COMMIT_MESSAGE=""
DEPLOY_BRANCH="${DEPLOY_BRANCH:-gh-pages}"

if [[ -z "$MODE" ]]; then
  echo "Error: mode is required (deploy or cleanup)" >&2
  exit 1
fi

shift

if [[ "$MODE" == "deploy" ]]; then
  SOURCE_DIR="${1:-}"
  if [[ -z "$SOURCE_DIR" ]]; then
    echo "Error: source_dir is required in deploy mode" >&2
    exit 1
  fi
  shift
elif [[ "$MODE" == "cleanup" ]]; then
  SUBDIR="${1:-}"
  if [[ -z "$SUBDIR" ]]; then
    echo "Error: subdir is required in cleanup mode" >&2
    exit 1
  fi
  shift
else
  echo "Error: invalid mode '$MODE' (must be 'deploy' or 'cleanup')" >&2
  exit 1
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --subdir)
      SUBDIR="${2:-}"
      shift 2
      ;;
    --message)
      COMMIT_MESSAGE="${2:-}"
      shift 2
      ;;
    --branch)
      DEPLOY_BRANCH="${2:-}"
      shift 2
      ;;
    *)
      echo "Error: unknown option '$1'" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$GITHUB_TOKEN" ]]; then
  echo "Error: GITHUB_TOKEN is required" >&2
  exit 1
fi

if [[ -z "$GITHUB_REPOSITORY" ]]; then
  echo "Error: GITHUB_REPOSITORY is required" >&2
  exit 1
fi

WORKSPACE="${GITHUB_WORKSPACE:-$PWD}"
REPO_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
DEPLOY_DIR=$(mktemp -d)

# shellcheck disable=SC2064
trap "rm -rf '$DEPLOY_DIR'" EXIT

# Clone or initialize deploy branch
if git ls-remote --exit-code --heads "$REPO_URL" "$DEPLOY_BRANCH" >/dev/null 2>&1; then
  git clone --branch "$DEPLOY_BRANCH" --single-branch "$REPO_URL" "$DEPLOY_DIR"
else
  git init "$DEPLOY_DIR"
  git -C "$DEPLOY_DIR" checkout -b "$DEPLOY_BRANCH"
  git -C "$DEPLOY_DIR" remote add origin "$REPO_URL"
fi

cd "$DEPLOY_DIR"

# Configure git user
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

if [[ "$MODE" == "deploy" ]]; then
  if [[ -z "$SUBDIR" ]]; then
    # Deploy to root: remove all except pr/ and .git/
    find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' ! -name 'pr' -exec rm -rf {} +
    cp -r "${WORKSPACE}/${SOURCE_DIR}/." .
  else
    # Deploy to subdir: remove and recreate subdir
    rm -rf "$SUBDIR"
    mkdir -p "$SUBDIR"
    cp -r "${WORKSPACE}/${SOURCE_DIR}/." "${SUBDIR}/"
  fi

  touch .nojekyll

  if [[ -z "$COMMIT_MESSAGE" ]]; then
    if [[ -z "$SUBDIR" ]]; then
      COMMIT_MESSAGE="deploy: update site"
    else
      COMMIT_MESSAGE="deploy: update ${SUBDIR}"
    fi
  fi

elif [[ "$MODE" == "cleanup" ]]; then
  if [[ ! -d "$SUBDIR" ]]; then
    echo "Directory ${SUBDIR} does not exist, nothing to clean up"
    exit 0
  fi

  rm -rf "$SUBDIR"

  # Remove parent directory if empty
  PARENT_DIR=$(dirname "$SUBDIR")
  if [[ "$PARENT_DIR" != "." ]] && [[ -d "$PARENT_DIR" ]] && [[ -z "$(ls -A "$PARENT_DIR")" ]]; then
    rm -rf "$PARENT_DIR"
  fi

  if [[ -z "$COMMIT_MESSAGE" ]]; then
    COMMIT_MESSAGE="cleanup: remove ${SUBDIR}"
  fi
fi

# Commit and push if there are changes
git add -A
if git diff --cached --quiet; then
  echo "No changes to commit"
  exit 0
fi

git commit -m "$COMMIT_MESSAGE"

# Push with retry (handles concurrent gh-pages updates from cleanup workflow)
MAX_RETRIES=3
for i in $(seq 1 $MAX_RETRIES); do
  if git push origin "$DEPLOY_BRANCH"; then
    echo "Successfully deployed to ${DEPLOY_BRANCH}"
    exit 0
  fi
  if [[ $i -lt $MAX_RETRIES ]]; then
    echo "Push failed (attempt $i/$MAX_RETRIES), rebasing on latest ${DEPLOY_BRANCH}..."
    git pull --rebase origin "$DEPLOY_BRANCH"
  fi
done

echo "Error: Failed to push after $MAX_RETRIES attempts" >&2
exit 1
