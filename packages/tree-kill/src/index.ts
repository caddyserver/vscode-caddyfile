import { ChildProcessWithoutNullStreams } from 'child_process';
import type { ExecException } from 'node:child_process';
import { exec, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { kill as killProcess } from 'node:process';

type ProcessTree = Map<number, number[]>;
type ProcessTree2 = Map<number, number>;
type Signal = string | number;
type Callback = (error?: ExecException) => void;
type SpawnChildProcessFunc = (pid: number) => ChildProcessWithoutNullStreams;

/**
 * Kills process identified by `pid` and all its children
 *
 * @param pid Process ID to kill
 * @param signal Signal to send to the process, defaults to 'SIGTERM'.
 * @param callback Callback function to call when a process is killed.
 */
function treeKill(pid: number, signal?: Signal, callback?: Callback): void {
	const tree: ProcessTree = new Map();
	tree.set(pid, []);

	const pidsToProcess: ProcessTree2 = new Map();
	pidsToProcess.set(pid, 1);

	switch (process.platform) {
		case 'win32':
			exec(`taskkill /pid ${pid.toString()} /T /F`, error => {
				if (callback === undefined) {
					return;
				}

				callback(error ?? undefined);
			});
			break;
		case 'darwin':
			buildProcessTree(
				pid,
				tree,
				pidsToProcess,
				parentPid => {
					return spawn(pathToPgrep(), ['-P', parentPid.toString()]);
				},
				function () {
					killAll(tree, signal, callback);
				},
			);
			break;
		default:
			// Linux
			buildProcessTree(
				pid,
				tree,
				pidsToProcess,
				parentPid => {
					return spawn('ps', ['-o', 'pid', '--no-headers', '--ppid', parentPid.toString()]);
				},
				() => {
					killAll(tree, signal, callback);
				},
			);
			break;
	}
}

function killAll(tree: ProcessTree, signal?: Signal, callback?: Callback): void {
	const killed: ProcessTree2 = new Map();

	try {
		for (const [pid, pids] of tree) {
			for (const pid2 of pids) {
				if (killed.get(pid2) !== undefined) {
					continue;
				}

				killPid(pid2, signal);
				killed.set(pid2, 1);
			}

			if (killed.get(pid) !== undefined) {
				continue;
			}

			killPid(pid, signal);
			killed.set(pid, 1);
		}
	} catch (error: unknown) {
		if (error instanceof Error && callback !== undefined) {
			return callback(error);
		}

		throw error;
	}

	if (callback !== undefined) {
		callback();
	}
}

function killPid(pid: number, signal?: Signal): void {
	try {
		killProcess(pid, signal);
	} catch (error: any) {
		if (error?.code === 'ESRCH') {
			// ESRCH === No such process
			return;
		}

		throw error;
	}
}

function buildProcessTree(
	parentPid: number,
	tree: ProcessTree,
	pidsToProcess: ProcessTree2,
	spawnChildProcessesList: SpawnChildProcessFunc,
	cb: Callback,
) {
	const ps = spawnChildProcessesList(parentPid);

	let allData = '';
	ps.stdout.on('data', v => {
		const data = v.toString('ascii');

		allData += data;
	});

	ps.on('close', code => {
		pidsToProcess.delete(parentPid);

		if (code != 0) {
			// no more parent processes
			if (pidsToProcess.size == 0) {
				cb();
			}
			return;
		}

		allData.match(/\d+/g)?.forEach(v => {
			const pid = parseInt(v, 10);

			const pids = tree.get(parentPid);
			tree.set(parentPid, pids?.concat(pid) ?? []);
			tree.set(pid, []);
			pidsToProcess.set(pid, 1);

			buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
		});
	});
}

let pgrep: string | undefined;

function pathToPgrep() {
	if (pgrep !== undefined) {
		return pgrep;
	}

	// Use the default pgrep, available since os x mountain lion.
	// proctools' pgrep does not implement `-P` correctly and returns
	// unrelated processes.
	// https://github.com/golang/vscode-go/issues/90#issuecomment-634430428
	try {
		pgrep = existsSync('/usr/bin/pgrep') ? '/usr/bin/pgrep' : 'pgrep';
	} catch (_: unknown) {
		pgrep = 'pgrep';
	}

	return pgrep;
}

export { treeKill };
