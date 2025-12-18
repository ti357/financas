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

app.post('/api/sync', (req, res) => {
    const { message } = req.body;
    const commitMsg = message || 'Auto-sync from web interface';

    // Command to add, commit and push
    // We use the project root as CWD
    const command = `git add . && git commit -m "${commitMsg}" && git push origin main`;

    console.log(`Executing: ${command}`);

    exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec error: ${error}`);
            // Check if it's just "nothing to commit" which isn't a fatal error for us
            if (stdout.includes('nothing to commit') || stderr.includes('nothing to commit')) {
                return res.json({ success: true, message: 'Nothing to commit', logs: stdout + stderr });
            }
            return res.status(500).json({ success: false, error: error.message, logs: stderr });
        }

        console.log(`Stdout: ${stdout}`);
        console.log(`Stderr: ${stderr}`);

        res.json({
            success: true,
            message: 'Sync successful',
            logs: stdout + stderr
        });
    });
});

app.listen(port, () => {
    console.log(`Server bridge running on http://localhost:${port}`);
    console.log(`Ready to execute git commands in ${projectRoot}`);
});
