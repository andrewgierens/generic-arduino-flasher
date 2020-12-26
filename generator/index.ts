var prompts = require('prompts');
const { exec } = require('child_process');
const packager = require('electron-packager');
const rimraf = require('rimraf');
const fs = require('fs-extra');

(async () => {
  const questions = [
    {
      type: 'text',
      name: 'PROJECT_NAME',
      message: 'What is the name of your project?',
      validate: value => !!value,
    },
    {
      type: 'text',
      name: 'PROJECT_LOGO_URL',
      message: 'What is the URL of your logo? (Leave blank if none)',
    },
    {
      type: 'text',
      name: 'PROJECT_CODE_URL',
      message: 'What is the URL for your "latest" code?',
      validate: value => !!value,
    },
  ];

  const response = await prompts(questions);

  const generateFrontEndCommand = `cross-env PROJECT_NAME="${response.PROJECT_NAME}" PROJECT_LOGO_URL="${response.PROJECT_LOGO_URL}" PROJECT_CODE_URL="${response.PROJECT_CODE_URL}" yarn build -d "output/${response.PROJECT_NAME}"`;

  exec(generateFrontEndCommand, async (error, _stdout, stderr) => {
    if (error) console.log('error', error);
    if (stderr) console.log('stderr', stderr);

    fs.copy('package.json', `output/${response.PROJECT_NAME}/package.json`, err => {
      if (err) throw err;
      console.log('package.json was copied');
    });

    fs.copy('main.js', `output/${response.PROJECT_NAME}/main.js`, err => {
      if (err) throw err;
      console.log('main.js was copied');
    });

    exec(`cd output/${response.PROJECT_NAME} && yarn`, (error, _stdout, stderr) => {
      if (error) console.log('error', error);
      if (stderr) console.log('stderr', stderr);
      packager(
        {
          dir: `output/${response.PROJECT_NAME}`,
          out: `output`,
          executableName: response.PROJECT_NAME,
          name: response.PROJECT_NAME,
          overwrite: true,
          version: '1.3.4',
          'version-string': {
            CompanyName: 'Andrew Gierens',
            FileDescription: response.PROJECT_NAME,
            OriginalFilename: response.PROJECT_NAME,
            ProductName: response.PROJECT_NAME,
            InternalName: response.PROJECT_NAME,
          },
          'app-copyright': 'Andrew Gierens',
          'app-version': '2.1.6',
        },
        (err, paths) => {
          if (err) console.log(err);
          if (paths) console.log(paths);
        },
      );
    });

    // rimraf(`output/${response.PROJECT_NAME}`, {}, () => {
    //   console.log(`Complete. ${appPaths}`);
    // });
  });
})();
