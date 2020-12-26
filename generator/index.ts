var prompts = require('prompts');
const { exec } = require('child_process');
const packager = require('electron-packager');
const rimraf = require('rimraf');
const fs = require('fs-extra');

const askQuestions = async () => {
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

  return await prompts(questions);
};

const buildFrontEnd = async questionResponse => {
  return new Promise((resolve, reject) => {
    const generateFrontEndCommand = `cross-env PROJECT_NAME="${questionResponse.PROJECT_NAME}" PROJECT_LOGO_URL="${questionResponse.PROJECT_LOGO_URL}" PROJECT_CODE_URL="${questionResponse.PROJECT_CODE_URL}" yarn build -d "output/${questionResponse.PROJECT_NAME}"`;

    exec(generateFrontEndCommand, err => {
      if (err) reject(err);
      if (!err) resolve({});
    });
  });
};

const copyFilesForElectron = async questionResponse => {
  return new Promise((resolve, reject) => {
    fs.copy('package.json', `output/${questionResponse.PROJECT_NAME}/package.json`, err => {
      if (err) reject(err);
    });

    fs.copy('main.js', `output/${questionResponse.PROJECT_NAME}/main.js`, err => {
      if (err) reject(err);
      if (!err) resolve({});
    });
  });
};

const executeYarn = async questionResponse => {
  return new Promise((resolve, reject) => {
    const generateYarnCommand = `cd output/${questionResponse.PROJECT_NAME} && yarn`;

    exec(generateYarnCommand, err => {
      if (err) reject(err);
      if (!err) resolve({});
    });
  });
};

(async () => {
  let questionquestionResponse: { PROJECT_NAME: string } = { PROJECT_NAME: '' };
  try {
    questionquestionResponse = await askQuestions();
  } catch (err) {
    console.log('Failed to fetch questions: ', err);
    return;
  }

  try {
    console.log('Building frontend...');
    await buildFrontEnd(questionquestionResponse);
  } catch (err) {
    console.log('Failed to build frontend: ', err);
    return;
  }

  try {
    console.log('Copying electron files...');
    await copyFilesForElectron(questionquestionResponse);
  } catch (err) {
    console.log('Failed to copy files: ', err);
    return;
  }

  try {
    console.log('Installing packages...');
    await executeYarn(questionquestionResponse);
  } catch (err) {
    console.log('Failed to install packages: ', err);
    return;
  }

  console.log('Packaging...');
  packager(
    {
      dir: `output/${questionquestionResponse.PROJECT_NAME}`,
      out: `output`,
      executableName: questionquestionResponse.PROJECT_NAME,
      name: questionquestionResponse.PROJECT_NAME,
      overwrite: true,
      'version-string': {
        CompanyName: 'Andrew Gierens',
        FileDescription: questionquestionResponse.PROJECT_NAME,
        OriginalFilename: questionquestionResponse.PROJECT_NAME,
        ProductName: questionquestionResponse.PROJECT_NAME,
        InternalName: questionquestionResponse.PROJECT_NAME,
      },
      'app-copyright': 'Andrew Gierens',
    },
    (err, paths) => {
      if (err) console.log(err);
      if (paths) console.log(paths);
    },
  );
})();
