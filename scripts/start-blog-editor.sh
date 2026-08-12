#!/bin/zsh

set -eu

project_dir=${0:A:h:h}
runtime_dir="$HOME/Library/Logs/LuyaoBlogEditor"
log_file="$runtime_dir/dev.log"
pid_file="$runtime_dir/server.pid"
target_url="http://127.0.0.1:4321/keystatic"
runtime_path="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

/bin/mkdir -p "$runtime_dir"

page_responds() {
	/usr/bin/curl -fsS --max-time 2 "$target_url" >/dev/null 2>&1
}

project_server_pid() {
	local candidate_pid
	local process_command

	candidate_pid=$(/usr/sbin/lsof -tiTCP:4321 -sTCP:LISTEN 2>/dev/null | /usr/bin/head -n 1 || true)
	[[ "$candidate_pid" == <-> ]] || return 1

	process_command=$(/bin/ps -p "$candidate_pid" -o command= 2>/dev/null || true)
	[[ "$process_command" == *"$project_dir/node_modules/.bin/astro dev"* || "$process_command" == *"$project_dir/node_modules/astro/astro.js dev"* ]] || return 1

	print -r -- "$candidate_pid"
}

optimizer_is_stale() {
	[[ -f "$log_file" ]] && /usr/bin/grep -Fq -- "optimize deps directory" "$log_file"
}

stop_project_server() {
	local server_pid=$1
	local attempt

	/bin/kill "$server_pid" 2>/dev/null || true
	for attempt in {1..40}; do
		/bin/kill -0 "$server_pid" 2>/dev/null || return 0
		/bin/sleep 0.1
	done

	print -u2 "旧的文章编辑服务未能正常停止。"
	return 1
}

start_project_server() {
	local server_pid
	local attempt

	: > "$log_file"
	cd "$project_dir"
	/usr/bin/nohup /usr/bin/env PATH="$runtime_path" "$project_dir/node_modules/.bin/astro" dev --host 127.0.0.1 --port 4321 --force >"$log_file" 2>&1 </dev/null &
	server_pid=$!
	print -r -- "$server_pid" > "$pid_file"

	for attempt in {1..60}; do
		if page_responds; then
			return 0
		fi
		/bin/kill -0 "$server_pid" 2>/dev/null || break
		/bin/sleep 0.5
	done

	print -u2 "文章编辑后台启动失败，请查看 $log_file"
	return 1
}

existing_pid=$(project_server_pid || true)

if page_responds && [[ -n "$existing_pid" ]] && ! optimizer_is_stale; then
	print -r -- "$existing_pid" > "$pid_file"
	exit 0
fi

if [[ -n "$existing_pid" ]]; then
	stop_project_server "$existing_pid"
elif /usr/sbin/lsof -tiTCP:4321 -sTCP:LISTEN >/dev/null 2>&1; then
	print -u2 "端口 4321 正被其他程序占用，无法启动文章编辑后台。"
	exit 1
fi

if optimizer_is_stale && [[ -d "$project_dir/node_modules/.vite" ]]; then
	/bin/rm -rf -- "$project_dir/node_modules/.vite"
fi

start_project_server
