import { TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
  assignee?: string;
  labels?: string[];
}

function getJiraConfig(): JiraConfig | null {
  const baseUrl = process.env.JIRA_BASE_URL?.trim();
  const email = process.env.JIRA_EMAIL?.trim();
  const apiToken = process.env.JIRA_API_TOKEN?.trim();
  const projectKey = process.env.JIRA_PROJECT_KEY?.trim();

  if (!baseUrl || !email || !apiToken || !projectKey) {
    return null;
  }

  return {
    baseUrl,
    email,
    apiToken,
    projectKey,
    assignee: process.env.JIRA_ASSIGNEE?.trim(),
    labels: process.env.JIRA_LABELS?.split(',').map((item) => item.trim()).filter(Boolean),
  };
}

function toJiraUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBase}${path}`;
}

function requestJira<T>(path: string, body: Record<string, unknown>, config: JiraConfig): Promise<T> {
  const url = new URL(toJiraUrl(config.baseUrl, path));
  const payload = JSON.stringify(body);

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Authorization': `Basic ${Buffer.from(`${config.email}:${config.apiToken}`).toString('base64')}`,
  };

  return new Promise((resolve, reject) => {
    const transport = url.protocol === 'https:' ? https : http;

    const req = transport.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: 'POST',
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(data ? JSON.parse(data) : ({} as T));
            } catch {
              resolve({} as T);
            }
            return;
          }

          reject(new Error(`Jira request failed with status ${res.statusCode}: ${data}`));
        });
      },
    );

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function requestJiraMultipart<T>(path: string, body: Buffer, config: JiraConfig, contentType: string): Promise<T> {
  const url = new URL(toJiraUrl(config.baseUrl, path));

  const headers = {
    'Accept': 'application/json',
    'Content-Type': contentType,
    'Content-Length': body.length,
    'Authorization': `Basic ${Buffer.from(`${config.email}:${config.apiToken}`).toString('base64')}`,
    'X-Atlassian-Token': 'no-check',
  };

  return new Promise((resolve, reject) => {
    const transport = url.protocol === 'https:' ? https : http;

    const req = transport.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: 'POST',
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(data ? JSON.parse(data) : ({} as T));
            } catch {
              resolve({} as T);
            }
            return;
          }

          reject(new Error(`Jira attachment request failed with status ${res.statusCode}: ${data}`));
        });
      },
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function buildIssueSummary(testInfo: TestInfo): string {
  return `[Playwright] ${testInfo.title} failed`;
}

async function getImageAttachmentBuffer(attachment: TestInfo['attachments'][number]): Promise<{ buffer: Buffer | null; contentType: string; fileName: string }> {
  const fileName = attachment.name || 'screenshot.png';
  const lowerName = fileName.toLowerCase();
  let contentType = attachment.contentType || 'image/png';

  if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
    contentType = 'image/jpeg';
  } else if (lowerName.endsWith('.png')) {
    contentType = 'image/png';
  }

  if (attachment.body) {
    const body = attachment.body as string | Buffer | Uint8Array | ArrayBuffer;
    if (Buffer.isBuffer(body)) {
      return { buffer: body, contentType, fileName };
    }

    if (body instanceof Uint8Array) {
      return { buffer: Buffer.from(body), contentType, fileName };
    }

    if (body instanceof ArrayBuffer) {
      return { buffer: Buffer.from(new Uint8Array(body)), contentType, fileName };
    }

    return { buffer: Buffer.from(body), contentType, fileName };
  }

  if (attachment.path) {
    try {
      return { buffer: await fs.promises.readFile(attachment.path), contentType, fileName };
    } catch {
      return { buffer: null, contentType, fileName };
    }
  }

  return { buffer: null, contentType, fileName };
}

async function buildIssueDescription(testInfo: TestInfo, errorMessage: string): Promise<string> {
  return [
    'Playwright test failure reported automatically.',
    `Test: ${testInfo.title}`,
    `File: ${testInfo.file}`,
    `Project: ${testInfo.project.name}`,
    `Retry: ${testInfo.retry}`,
    '',
    'Error:',
    errorMessage,
  ].join('\n');
}

async function uploadScreenshotAttachments(issueKey: string, testInfo: TestInfo, config: JiraConfig): Promise<void> {
  const boundary = `----playwright-${Date.now()}`;

  for (const attachment of testInfo.attachments || []) {
    const name = attachment.name?.toLowerCase() || '';
    const isImageAttachment = attachment.contentType?.startsWith('image/') || name.includes('screenshot') || name.includes('.png') || name.includes('.jpg') || name.includes('.jpeg');

    if (!isImageAttachment) {
      continue;
    }

    const { buffer, contentType, fileName } = await getImageAttachmentBuffer(attachment);
    if (!buffer) {
      continue;
    }

    const partHeader = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="${fileName}"`,
      `Content-Type: ${contentType}`,
      '',
      '',
    ].join('\r\n');

    const partBody = Buffer.concat([Buffer.from(partHeader), buffer, Buffer.from('\r\n')]);
    const multipartBody = Buffer.concat([partBody, Buffer.from(`--${boundary}--\r\n`)]);

    try {
      await requestJiraMultipart<{ id?: string }>(`/rest/api/2/issue/${issueKey}/attachments`, multipartBody, config, `multipart/form-data; boundary=${boundary}`);
    } catch (error) {
      console.warn(`[Jira] Failed to upload attachment ${fileName} for issue ${issueKey}:`, error);
    }
  }
}

export async function reportTestFailureToJira(testInfo: TestInfo): Promise<void> {
  const config = getJiraConfig();

  if (!config) {
    return;
  }

  const errorMessage = testInfo.error?.message || 'No error message captured.';

  try {
    const description = await buildIssueDescription(testInfo, errorMessage);

    const payload = {
      fields: {
        project: { key: config.projectKey },
        summary: buildIssueSummary(testInfo),
        description,
        issuetype: { name: 'Bug' },
        labels: config.labels || ['playwright', 'automated-test'],
        ...(config.assignee ? { assignee: { name: config.assignee } } : {}),
      },
    };

    const response = await requestJira<{ key?: string; id?: string }>(
      '/rest/api/2/issue',
      payload,
      config,
    );

    const issueKey = response.key || response.id;
    if (!issueKey) {
      console.warn(`[Jira] Issue created but response did not include a key or id for failed test ${testInfo.title}`);
      return;
    }

    console.log(`[Jira] Created issue ${issueKey} for failed test ${testInfo.title}`);
    await uploadScreenshotAttachments(issueKey, testInfo, config);
  } catch (error) {
    console.warn('[Jira] Failed to report test result:', error);
  }
}
