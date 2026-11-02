// The keyboard, as in k9s: j/k or the arrows move the cursor, enter opens the
// row, esc goes back, 0-3 switch views, ":" takes a command and "/" filters.
// Plus a few things k9s users will try: ?, l, s, ctrl-d and :skin.
// Without this file every row and key hint is still an ordinary link.
(function () {
	var rows = Array.prototype.slice.call(document.querySelectorAll("[data-nav] tbody tr"));
	var view = document.querySelector(".view");
	var prompt = document.querySelector(".prompt");
	var input = prompt.querySelector("input");
	var flash = document.querySelector(".flash");
	var back = document.body.getAttribute("data-back");
	var skins = ["stock", "dracula", "gruvbox", "solarized", "nord"];
	var commands = {
		projects: "/", project: "/", proj: "/", pods: "/", po: "/",
		blog: "/blog/", posts: "/blog/", logs: "/blog/",
		about: "/about/", me: "/about/", people: "/about/",
		lab: "/lab/", nodes: "/lab/", no: "/lab/", cluster: "/lab/",
		xray: "/xray/", x: "/xray/",
		events: "/events/", ev: "/events/",
		pulses: "/pulses/", pulse: "/pulses/", pu: "/pulses/",
		bench: "/bench/", benchmarks: "/bench/", be: "/bench/",
	};
	var mode = null;
	var cur = 0;
	var overlay = null;

	function say(text, kind) {
		flash.textContent = text;
		flash.className = "flash" + (kind ? " " + kind : "");
	}

	function shown() {
		return rows.filter(function (r) { return !r.hidden; });
	}

	function select(i) {
		var list = shown();
		rows.forEach(function (r) { r.classList.remove("cursor"); });
		if (!list.length)
			return;
		cur = Math.max(0, Math.min(i, list.length - 1));
		list[cur].classList.add("cursor");
		list[cur].scrollIntoView({ block: "nearest" });
	}

	function open(m) {
		mode = m;
		prompt.hidden = false;
		prompt.querySelector(".mode").textContent = m === ":" ? ">" : "/";
		input.value = "";
		input.focus();
	}

	function close() {
		mode = null;
		prompt.hidden = true;
		input.blur();
	}

	function filter(q) {
		q = q.toLowerCase();
		rows.forEach(function (r) { r.hidden = q !== "" && r.textContent.toLowerCase().indexOf(q) < 0; });
		select(0);
	}

	function el(tag, cls, text) {
		var e = document.createElement(tag);
		if (cls)
			e.className = cls;
		if (text !== undefined)
			e.textContent = text;
		return e;
	}

	// A k9s dialog: a framed box over everything, closed by esc.
	function dialog(title, cls) {
		shut();
		overlay = el("div", "overlay");
		var box = el("section", "dialog " + (cls || ""));
		box.appendChild(el("h2", "dialog-title", title));
		overlay.appendChild(box);
		overlay.addEventListener("click", function (e) { if (e.target === overlay) shut(); });
		document.body.appendChild(overlay);
		return box;
	}

	function shut() {
		if (overlay)
			overlay.remove();
		overlay = null;
	}

	function skin(name) {
		if (skins.indexOf(name) < 0) {
			say("Boom!! no such skin, try: " + skins.join(", "), "err");
			return;
		}
		if (name === "stock")
			delete document.documentElement.dataset.skin;
		else
			document.documentElement.dataset.skin = name;
		try { localStorage.setItem("skin", name); } catch (e) {}
		say("Skin " + name + " loaded");
	}

	function help() {
		var box = dialog("Help", "help");
		var cols = [
			["RESOURCE", [["0", "projects"], ["1", "blog"], ["2", "about"], ["3", "lab"], ["4", "bench"],
				[":xray", "everything as a tree"], [":events", "a life in events"], [":pulses", "the cluster today"]]],
			["GENERAL", [[":", "command"], ["/", "filter"], ["?", "this help"], ["esc", "back"],
				[":skin", skins.join(" | ")], [":q", "quit"]]],
			["NAVIGATION", [["j", "down"], ["k", "up"], ["enter", "open"], ["l", "logs"],
				["s", "shell into marcos"], ["ctrl-d", "delete"]]],
		];
		var grid = el("div", "help-grid");
		cols.forEach(function (c) {
			var col = el("div");
			col.appendChild(el("h3", null, c[0]));
			c[1].forEach(function (k) {
				var line = el("p");
				line.appendChild(el("b", /^\d$/.test(k[0]) ? "num" : "key", "<" + k[0] + ">"));
				line.appendChild(document.createTextNode(" " + k[1]));
				col.appendChild(line);
			});
			grid.appendChild(col);
		});
		box.appendChild(grid);
	}

	function remove() {
		var row = shown()[cur];
		var name = row ? row.querySelector("td").textContent.trim() : "marcos-ashton-iglesias";
		var box = dialog("Delete", "confirm");
		box.appendChild(el("p", null, "Delete " + name + "?"));
		var buttons = el("p", "buttons");
		[0, 1].forEach(function () {
			var b = el("button", null, "No");
			b.addEventListener("click", function () {
				shut();
				say("Delete cancelled. " + name + " is load-bearing");
			});
			buttons.appendChild(b);
		});
		box.appendChild(buttons);
		buttons.firstChild.focus();
	}

	// s: kubectl exec into marcos. A pretend shell over /shell.json.
	function shell() {
		var box = dialog("kubectl exec -it marcos-ashton-iglesias -- sh", "shell");
		var out = el("pre", "shell-out");
		var line = el("p", "shell-line");
		var ps1 = el("span", "ps1", "marcos@homelab:~$ ");
		var cmd = el("input");
		var history = [];
		var hpos = 0;
		var data = null;

		cmd.setAttribute("aria-label", "Shell");
		cmd.autocomplete = "off";
		cmd.spellcheck = false;
		line.appendChild(ps1);
		line.appendChild(cmd);
		box.appendChild(out);
		box.appendChild(line);
		cmd.focus();

		function print(text, cls) {
			out.appendChild(el("span", cls, text + "\n"));
			out.scrollTop = out.scrollHeight;
		}

		function info(label) {
			var dts = document.querySelectorAll(".info dt");
			for (var i = 0; i < dts.length; i++)
				if (dts[i].textContent === label + ":")
					return dts[i].nextElementSibling.textContent;
			return "n/a";
		}

		function days(since) {
			return Math.floor((Date.now() - Date.parse(since)) / 86400000);
		}

		function run(text) {
			var argv = text.trim().split(/\s+/);
			var c = argv[0];
			var arg = argv.slice(1).join(" ");
			var p = data ? data.projects : [];
			if (!c)
				return;
			if (c === "help") {
				print("whoami  ls [projects|blog]  cat <file>  cd <dir>  uptime  neofetch  date  pwd  echo  history  clear  exit");
			} else if (c === "whoami") {
				print(data.name + ": " + data.tagline);
			} else if (c === "ls" && (arg === "" || arg === "~")) {
				print("projects/  blog/  cv.yaml  README.md", "dir");
			} else if (c === "ls" && /^projects\/?$/.test(arg)) {
				p.forEach(function (x) { print(x.id + "  " + x.status, x.status === "Completed" ? "dim" : "dir"); });
			} else if (c === "ls" && /^blog\/?$/.test(arg)) {
				data.posts.forEach(function (x) { print(x.slug); });
			} else if (c === "cat" && arg === "README.md") {
				print(data.tagline);
				print("Type help for commands. Recruiters, try: sudo hire-me", "dim");
			} else if (c === "cat" && arg === "cv.yaml") {
				print("kind: Person\nname: " + data.name + "\nprojects: " + p.length + "\nfull version: :about", "yaml");
			} else if (c === "cd" || c === "open") {
				var to = { "": "/", "~": "/", projects: "/", "projects/": "/", blog: "/blog/", "blog/": "/blog/" }[arg];
				p.forEach(function (x) { if (x.id === arg) to = "/projects/" + x.id + "/"; });
				if (to)
					location.href = to;
				else
					print("sh: cd: " + arg + ": No such file or directory", "err");
			} else if (c === "uptime") {
				print("up " + days("2024-05-13") + " days since the first commit, cluster cpu " + info("CPU"));
			} else if (c === "neofetch") {
				print([" __  __      marcos@homelab", "|  \\/  |     OS: NixOS, k3s " + info("K8s Rev"),
					"| |\\/| |     Site: forge (C17)", "| |  | |     Projects: " + p.length,
					"|_|  |_|     CPU: " + info("CPU") + "  MEM: " + info("MEM")].join("\n"), "fetch");
			} else if (c === "date") {
				print(new Date().toString());
			} else if (c === "pwd") {
				print("/home/marcos");
			} else if (c === "echo") {
				print(arg);
			} else if (c === "history") {
				history.forEach(function (h, i) { print(String(i + 1).padStart(4) + "  " + h); });
			} else if (c === "clear") {
				out.textContent = "";
			} else if (c === "exit" || c === "logout") {
				shut();
			} else if (c === "sudo" && arg === "hire-me") {
				print("Opening a draft to " + data.email + " ...", "ok");
				location.href = "mailto:" + data.email + "?subject=" + encodeURIComponent("Saw your website");
			} else if (c === "sudo") {
				print("marcos is not in the sudoers file. This incident will be reported.", "err");
			} else if (c === "rm") {
				print("rm: refusing. The homelab already lost a control plane this week.", "err");
			} else if (c === "kubectl" || c === "k9s") {
				print("You are already inside it.");
			} else if (c === "vim" || c === "vi" || c === "nvim") {
				print("Good choice. Not here though, try exit.");
			} else {
				print("sh: " + c + ": not found", "err");
			}
		}

		cmd.addEventListener("keydown", function (e) {
			e.stopPropagation();
			if (e.key === "Escape") {
				shut();
			} else if (e.key === "ArrowUp" && history.length) {
				hpos = Math.max(0, hpos - 1);
				cmd.value = history[hpos];
				e.preventDefault();
			} else if (e.key === "ArrowDown" && history.length) {
				hpos = Math.min(history.length, hpos + 1);
				cmd.value = history[hpos] || "";
				e.preventDefault();
			} else if (e.key === "Enter") {
				var text = cmd.value;
				print(ps1.textContent + text, "echo");
				if (text.trim())
					history.push(text);
				hpos = history.length;
				cmd.value = "";
				if (data)
					run(text);
				else
					print("still connecting...", "dim");
			}
		});

		print("Defaulted container \"marcos\" out of: marcos, coffee (init)", "dim");
		fetch("/shell.json").then(function (r) { return r.json(); }).then(function (d) {
			data = d;
			print("Type help for commands.", "dim");
		}).catch(function () {
			print("error: unable to upgrade connection", "err");
		});
	}

	input.addEventListener("input", function () {
		if (mode === "/")
			filter(input.value);
	});

	input.addEventListener("keydown", function (e) {
		e.stopPropagation();
		if (e.key === "Escape") {
			if (mode === "/")
				filter("");
			close();
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (mode === ":") {
				var words = input.value.trim().toLowerCase().split(/\s+/);
				var c = words[0];
				var to = commands[c] || (document.querySelector('a[href="/projects/' + c + '/"]') ? "/projects/" + c + "/" : null);
				if (to)
					location.href = to;
				else if (c === "skin")
					skin(words[1] || "stock");
				else if (c === "help" || c === "?")
					help();
				else if (c === "q" || c === "q!" || c === "quit" || c === "exit")
					say("You can't quit, there's a deploy in flight", "warn");
				else if (c)
					say("Boom!! unknown command: " + c, "err");
			}
			close();
		}
	});

	document.addEventListener("keydown", function (e) {
		if (mode || e.altKey || e.metaKey)
			return;
		if (overlay) {
			if (e.key === "Escape")
				shut();
			return;
		}
		var k = e.key;
		if (e.ctrlKey) {
			if (k === "d") {
				e.preventDefault();
				remove();
			}
			return;
		}
		if (k === "j" || k === "ArrowDown" || k === "k" || k === "ArrowUp") {
			var step = k === "j" || k === "ArrowDown" ? 1 : -1;
			if (rows.length)
				select(cur + step);
			else
				view.scrollBy(0, step * 60);
			e.preventDefault();
		} else if (k === "Enter" && rows.length) {
			var row = shown()[cur];
			var link = row && row.querySelector("a");
			if (link)
				link.click();
		} else if (k === "l") {
			var r = shown()[cur];
			var logs = (r && r.getAttribute("data-logs")) || (document.querySelector("a[data-logs]") || {}).href;
			if (logs)
				location.href = logs;
			else
				say("No logs for this one");
		} else if (k === "s") {
			e.preventDefault();
			shell();
		} else if (k === "?") {
			help();
		} else if ((k === "Escape" || k === "q") && back) {
			location.href = back;
		} else if (k === ":") {
			e.preventDefault();
			open(":");
		} else if (k === "/" && rows.length) {
			e.preventDefault();
			open("/");
		} else {
			var hint = document.querySelector('[data-key="' + k + '"]');
			if (hint)
				location.href = hint.getAttribute("href");
		}
	});

	rows.forEach(function (r) {
		r.addEventListener("mouseenter", function () { if (!r.hidden) select(shown().indexOf(r)); });
	});

	// The 404 page: the path that was asked for, and a different failure each time.
	document.querySelectorAll("[data-path]").forEach(function (e) { e.textContent = location.pathname; });
	var reasons = ["CrashLoopBackOff", "ImagePullBackOff", "OOMKilled", "ErrImagePull", "Evicted", "CreateContainerConfigError"];
	document.querySelectorAll("[data-reason]").forEach(function (e) {
		e.textContent = reasons[Math.floor(Math.random() * reasons.length)];
	});

	if (rows.length)
		select(0);

	console.log("%c __  __\n|  \\/  | __ _ _ __ ___ ___  ___\n| |\\/| |/ _` | '__/ __/ _ \\/ __|\n| |  | | (_| | | | (_| (_) \\__ \\\n|_|  |_|\\__,_|_|  \\___\\___/|___/",
		"color:#ffa500;font-family:monospace");
	console.log("%cYou opened the console, so you are my kind of person. Press s on the page and try sudo hire-me, or just email me.",
		"color:#00ffff;font-family:monospace");
})();
