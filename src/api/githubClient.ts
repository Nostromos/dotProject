import { Octokit, App } from "octokit";
import dotenv from 'dotenv';

dotenv.config();

const ok = new Octokit({ auth: process.env.GITHUB_API_AUTH_TOKEN });

export default ok;