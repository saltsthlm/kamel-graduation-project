const getRandomLanguage = () => {
  const languages = ['es', 'sv'];
  return languages[Math.floor(Math.random() * languages.length)];
};

module.exports = {
  getRandomLanguage,
};
