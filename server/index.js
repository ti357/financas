import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

app.post('/api/sync', async (req, res) => {
    const { message } = req.body;
    const commitMsg = message || 'Auto-sync from web interface';

    const runCommand = (cmd) => {
        return new Promise((resolve, reject) => {
            console.log(`Running: ${cmd}`);
            exec(cmd, { cwd: projectRoot }, (error, stdout, stderr) => {
                if (error) {
                    // If it's a commit error saying "nothing to commit", we treat it as success
                    if (cmd.startsWith('git commit') && (stdout.includes('nothing to commit') || stderr.includes('nothing to commit'))) {
                        return resolve({ stdout, stderr });
                    }
                    return reject({ error, stdout, stderr });
                }
                resolve({ stdout, stderr });
            });
        });
    };

    try {
        let logs = '';

        // 1. Add changes
        const add = await runCommand('git add .');
        logs += 'Step 1 (Add): Done\n';

        // 2. Commit (might fail if nothing to commit, handled inside runCommand)
        try {
            await runCommand(`git commit -m "${commitMsg}"`);
            logs += 'Step 2 (Commit): Done\n';
        } catch (e) {
            // Logic inside runCommand handles "nothing to commit", so real errors come here
            throw e;
        }

        // 3. Pull (Fetch & Merge remote changes)
        // Using --no-rebase to creates a merge commit if necessary, which is safer for beginners
        const pull = await runCommand('git pull origin main --no-rebase');
        logs += `Step 3 (Pull): ${pull.stdout}\n`;

        // 4. Push
        const push = await runCommand('git push origin main');
        logs += `Step 4 (Push): ${push.stdout}\n`;

        res.json({
            success: true,
            message: 'Sync successful',
            logs: logs
        });

    } catch (err) {
        console.error('Sync failed:', err);
        res.status(500).json({
            success: false,
            error: err.error ? err.error.message : 'Unknown error',
            logs: `Command failed.\nError: ${err.stderr || err.error?.message}\nOutput: ${err.stdout}`
        });
    }
});

app.listen(port, () => {
    console.log(`Server bridge running on http://localhost:${port}`);
    console.log(`Ready to execute git commands in ${projectRoot}`);
});
