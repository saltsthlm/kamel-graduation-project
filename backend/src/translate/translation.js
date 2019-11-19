const { Translate } = require('@google-cloud/translate').v2;

const translationClient = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  key: process.env.GOOGLE_KEY,
});

const translate = async (text, target) => {
  const [translation] = await translationClient.translate(text, target);
  return translation;
};

module.exports = { translate };
