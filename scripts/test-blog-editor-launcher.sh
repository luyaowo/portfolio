#!/bin/zsh

set -eu

repo_root=${0:A:h:h}
applescript_file="$repo_root/scripts/blog-editor-launcher.applescript"
starter_file="$repo_root/scripts/start-blog-editor.sh"

assert_contains() {
	local file_path=$1
	local expected=$2
	local label=$3

	if [[ ! -f "$file_path" ]]; then
		print -u2 "FAIL: $label — missing $file_path"
		return 1
	fi

	if ! /usr/bin/grep -Fq -- "$expected" "$file_path"; then
		print -u2 "FAIL: $label — expected '$expected'"
		return 1
	fi

	print "PASS: $label"
}

assert_contains "$applescript_file" "start-blog-editor.sh" "app delegates lifecycle checks"
assert_contains "$applescript_file" "?launch=" "app opens a fresh URL"
assert_contains "$starter_file" "optimize deps directory" "starter detects stale Vite chunks"
assert_contains "$starter_file" "--force" "repair start rebuilds Vite caches"
assert_contains "$starter_file" "node_modules/.bin/astro dev" "starter owns a directly managed Astro process"
assert_contains "$starter_file" "/opt/homebrew/bin:/usr/local/bin" "starter provides Node paths for macOS app launches"

/bin/zsh -n "$starter_file"
