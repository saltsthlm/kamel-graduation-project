'use strict';
const getRandomLanguage = () => {
  const languages = ['en', 'de'];
  return languages[Math.floor(Math.random() * languages.length)];
};

module.exports = {
  getRandomLanguage,
};
