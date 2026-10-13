const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Додаємо підтримку розширень mjs та додатковий резолвер для Convex
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Налаштовуємо резолвер, щоб прибрати проблеми з імпортами .js у ESM модулях Convex
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('./') && moduleName.endsWith('.js') && context.originModulePath.includes('node_modules\\convex')) {
    const cleanName = moduleName.slice(0, -3);
    try {
      return context.resolveRequest(context, cleanName, platform);
    } catch {
      // Якщо без .js не знайшло, залишаємо стандартну логіку
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;