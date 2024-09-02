const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const unzipper = require('unzipper');

const REPO_OWNER = 'keeweb';
const REPO_NAME = 'keeweb';
const BUILD_DIR = 'build';

async function getLatestRelease()
{
	const { data } = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`);
	return data;
}

async function downloadFile(url, destination)
{
  const { data } = await axios({
	url,
	responseType: 'stream',
  });
  const writer = fs.createWriteStream(destination);
  data.pipe(writer);
  return new Promise((resolve, reject) => {
	writer.on('finish', resolve);
	writer.on('error', reject);
  });
}

async function extractZip(zipPath, extractTo)
{
  fs.createReadStream(zipPath)
	.pipe(unzipper.Extract({ path: extractTo }))
	.promise()
	.then(() => console.log('Extraction complete'), (e) => console.error('Extraction failed', e));
}

async function main()
{
  	try
	{
		const release = await getLatestRelease();
		const { tag_name } = release;
		const version = tag_name.replace('v', ''); // Remove the "v" prefix from the tag name
		const zipFileName = `KeeWeb-${version}.html.zip`;
		const zipUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/${tag_name}/${zipFileName}`;
		const zipPath = path.join(BUILD_DIR, zipFileName);

		await fs.ensureDir(BUILD_DIR);

		console.log(`Downloading ${zipFileName} from ${zipUrl}`);
		await downloadFile(zipUrl, zipPath);

		console.log(`Unzipping ${zipFileName}`);
		await extractZip(zipPath, BUILD_DIR);

		console.log('Download and extraction complete');
  	} 
	catch (error)
	{
		console.error('Error during download or extraction:', error);
  	}
}

main();
