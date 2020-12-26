var prompts = require('prompts');
const { exec } = require('child_process');

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

  const generateCommand = `cross-env PROJECT_NAME=${response.PROJECT_NAME} PROJECT_LOGO_URL=${response.PROJECT_LOGO_URL} PROJECT_CODE_URL=${response.PROJECT_CODE_URL} yarn build -d "output/${response.PROJECT_NAME}"`;

  exec(generateCommand, (error, _stdout, stderr) => {
    if (error) console.log('error', error);
    if (stderr) console.log('stderr', stderr);

    console.log(`Complete. Your application is in the "output/${response.PROJECT_NAME}"`);
  });
})();
