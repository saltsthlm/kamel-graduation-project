`use strict`;
const { Translate } = require('@google-cloud/translate').v2;

const translationClient = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  key: process.env.GOOGLE_KEY,
});

const translate = async (text, target) => {
  try {
    const [translation] = await translationClient.translate(text, target);
    return translation;
  } catch (error) {
    throw error;
  }
};

module.exports = { translate };
